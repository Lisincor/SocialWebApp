package com.heartmatch.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.heartmatch.dto.CommentRequest;
import com.heartmatch.dto.CommentResponse;
import com.heartmatch.entity.Comment;
import com.heartmatch.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String USER_INFO_CACHE_PREFIX = "user:info:";

    /**
     * 获取评论列表
     */
    public List<CommentResponse> getComments(Long postId, Long userId) {
        LambdaQueryWrapper<Comment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Comment::getPostId, postId)
            .eq(Comment::getStatus, 1)
            .orderByDesc(Comment::getCreatedAt);

        List<Comment> comments = commentRepository.selectList(wrapper);

        // 区分顶级评论和回复
        List<Comment> topLevelComments = comments.stream()
            .filter(c -> c.getParentId() == null)
            .collect(Collectors.toList());

        Map<Long, List<Comment>> repliesMap = comments.stream()
            .filter(c -> c.getParentId() != null)
            .collect(Collectors.groupingBy(Comment::getParentId));

        return topLevelComments.stream()
            .map(c -> convertToResponse(c, userId, repliesMap.getOrDefault(c.getId(), List.of())))
            .collect(Collectors.toList());
    }

    /**
     * 发表评论
     */
    @Transactional
    public CommentResponse createComment(Long userId, Long postId, CommentRequest request) {
        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setParentId(request.getParentId());
        comment.setContent(request.getContent());
        comment.setLikeCount(0);
        comment.setReplyCount(0);
        comment.setStatus(1);

        commentRepository.insert(comment);

        // 更新回复数
        if (request.getParentId() != null) {
            Comment parent = commentRepository.selectById(request.getParentId());
            if (parent != null) {
                parent.setReplyCount(parent.getReplyCount() + 1);
                commentRepository.updateById(parent);
            }
        }

        return convertToResponse(comment, userId, List.of());
    }

    /**
     * 删除评论
     */
    @Transactional
    public void deleteComment(Long userId, Long commentId) {
        Comment comment = commentRepository.selectById(commentId);
        if (comment == null || !comment.getUserId().equals(userId)) {
            throw new RuntimeException("无权删除");
        }
        comment.setStatus(0);
        commentRepository.updateById(comment);
    }

    /**
     * 点赞评论
     */
    @Transactional
    public void likeComment(Long userId, Long commentId) {
        String likeKey = "comment:like:" + userId + ":" + commentId;
        if (Boolean.TRUE.equals(redisTemplate.hasKey(likeKey))) {
            throw new RuntimeException("已点赞");
        }

        Comment comment = commentRepository.selectById(commentId);
        if (comment != null) {
            comment.setLikeCount(comment.getLikeCount() + 1);
            commentRepository.updateById(comment);
            redisTemplate.opsForValue().set(likeKey, 1, 24, TimeUnit.HOURS);
        }
    }

    private CommentResponse convertToResponse(Comment comment, Long userId, List<Comment> replies) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setPostId(comment.getPostId());
        response.setUserId(comment.getUserId());
        response.setContent(comment.getContent());
        response.setParentId(comment.getParentId());
        response.setLikeCount(comment.getLikeCount());
        response.setReplyCount(comment.getReplyCount());
        response.setCreatedAt(comment.getCreatedAt().toString());

        // 检查点赞状态
        String likeKey = "comment:like:" + userId + ":" + comment.getId();
        response.setIsLiked(Boolean.TRUE.equals(redisTemplate.hasKey(likeKey)));

        // 获取用户信息（昵称、头像）- 从 Redis 缓存或 user-service
        Map<String, String> userInfo = getUserInfo(comment.getUserId());
        response.setNickname(userInfo.getOrDefault("nickname", "用户" + comment.getUserId()));
        response.setAvatar(userInfo.get("avatar"));

        // 转换回复
        List<CommentResponse> replyResponses = replies.stream()
            .map(r -> convertToResponse(r, userId, List.of()))
            .collect(Collectors.toList());
        response.setReplies(replyResponses);

        return response;
    }

    /**
     * 获取用户信息（昵称、头像）
     */
    private Map<String, String> getUserInfo(Long userId) {
        Map<String, String> userInfo = new HashMap<>();

        // 先从 Redis 缓存获取
        String cacheKey = USER_INFO_CACHE_PREFIX + userId;
        try {
            Object cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, String> cachedInfo = (Map<String, String>) cached;
                return cachedInfo;
            }
        } catch (Exception e) {
            log.debug("Redis get user info failed: {}", e.getMessage());
        }

        // 从 user-service 获取
        try {
            String url = "http://user-service:8081/api/v1/users/internal/" + userId + "/basic";
            Map response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("data")) {
                @SuppressWarnings("unchecked")
                Map<String, Object> data = (Map<String, Object>) response.get("data");
                userInfo.put("nickname", String.valueOf(data.getOrDefault("nickname", "")));
                userInfo.put("avatar", String.valueOf(data.getOrDefault("avatar", "")));

                // 缓存到 Redis
                redisTemplate.opsForValue().set(cacheKey, userInfo, 5, TimeUnit.MINUTES);
            }
        } catch (Exception e) {
            log.warn("获取用户 {} 信息失败: {}", userId, e.getMessage());
        }

        return userInfo;
    }
}