package com.heartmatch.service;

import com.alibaba.fastjson2.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heartmatch.dto.PostRequest;
import com.heartmatch.dto.PostResponse;
import com.heartmatch.dto.PageResponse;
import com.heartmatch.entity.Post;
import com.heartmatch.entity.LikeRecord;
import com.heartmatch.entity.Favorite;
import com.heartmatch.repository.PostRepository;
import com.heartmatch.repository.LikeRecordRepository;
import com.heartmatch.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final LikeRecordRepository likeRecordRepository;
    private final FavoriteRepository favoriteRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * 获取Feed列表（带推荐算法）
     * Score = (互动分 × 0.4) + (关系分 × 0.3) + (新鲜分 × 0.2) + (热度分 × 0.1)
     */
    public PageResponse<PostResponse> getFeed(Long userId, String feedType, Integer page, Integer pageSize) {
        Page<Post> postPage = new Page<>(page, pageSize);

        LambdaQueryWrapper<Post> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Post::getStatus, 1)
            .orderByDesc(Post::getCreatedAt);

        if ("video".equals(feedType)) {
            wrapper.eq(Post::getType, 2);
        }

        Page<Post> result = postRepository.selectPage(postPage, wrapper);

        List<PostResponse> list = result.getRecords().stream()
            .map(post -> convertToResponse(post, userId))
            // 按推荐分数排序
            .sorted((a, b) -> Double.compare(calculateRecommendationScore(b), calculateRecommendationScore(a)))
            .collect(Collectors.toList());

        return PageResponse.of(list, result.getTotal(), (int) result.getCurrent(), (int) result.getSize());
    }

    /**
     * 计算推荐分数
     * Score = (互动分 × 0.4) + (关系分 × 0.3) + (新鲜分 × 0.2) + (热度分 × 0.1)
     */
    private double calculateRecommendationScore(PostResponse post) {
        // 互动分 = (点赞数×1 + 评论数×3 + 分享数×5) / 基准值(100)
        double interactionScore = (post.getLikeCount() * 1.0 + post.getCommentCount() * 3.0 + post.getShareCount() * 5.0) / 100.0;

        // 关系分 = 关注状态(0.3) + 互动过(0.2) + 同一城市(0.1)
        double relationScore = 0.3 + 0.2 + 0.1; // TODO: 根据用户实际关系计算

        // 新鲜分 = e^(-天差/7)
        double freshnessScore = 1.0;
        if (post.getCreatedAt() != null) {
            try {
                long daysDiff = java.time.temporal.ChronoUnit.DAYS.between(
                    java.time.LocalDateTime.parse(post.getCreatedAt().replace(" ", "T")),
                    java.time.LocalDateTime.now()
                );
                freshnessScore = Math.exp(-daysDiff / 7.0);
            } catch (Exception e) {
                freshnessScore = 1.0;
            }
        }

        // 热度分 = (当前小时点赞 + 当前小时评论) / 基准值(50)
        double hotScore = (post.getLikeCount() + post.getCommentCount()) / 50.0;

        // 综合分数
        return interactionScore * 0.4 + relationScore * 0.3 + freshnessScore * 0.2 + hotScore * 0.1;
    }

    /**
     * 获取用户动态列表
     */
    public PageResponse<PostResponse> getUserPosts(Long userId, Long targetUserId, Integer page, Integer pageSize) {
        Page<Post> postPage = new Page<>(page, pageSize);

        LambdaQueryWrapper<Post> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Post::getUserId, targetUserId)
            .eq(Post::getStatus, 1)
            .orderByDesc(Post::getCreatedAt);

        Page<Post> result = postRepository.selectPage(postPage, wrapper);

        List<PostResponse> list = result.getRecords().stream()
            .map(post -> convertToResponse(post, userId))
            .collect(Collectors.toList());

        return PageResponse.of(list, result.getTotal(), (int) result.getCurrent(), (int) result.getSize());
    }

    /**
     * 发布动态
     */
    @Transactional
    public PostResponse createPost(Long userId, PostRequest request) {
        Post post = new Post();
        post.setUserId(userId);
        post.setContent(request.getContent());
        post.setType(request.getType() != null ? request.getType() : 1);
        post.setMediaUrls(request.getMediaUrls() != null ? JSON.toJSONString(request.getMediaUrls()) : null);
        post.setMusicId(request.getMusicId());
        post.setMusicTitle(request.getMusicTitle());
        post.setLocation(request.getLocation());
        post.setTopicId(request.getTopicId());
        post.setLikeCount(0);
        post.setCommentCount(0);
        post.setShareCount(0);
        post.setViewCount(0);
        post.setStatus(1);
        post.setAuditStatus(0);

        // 故事类型设置过期时间
        if (post.getType() == 3) {
            post.setExpireAt(LocalDateTime.now().plusHours(24));
        }

        postRepository.insert(post);
        return convertToResponse(post, userId);
    }

    /**
     * 获取动态详情
     */
    public PostResponse getPostById(Long postId, Long userId) {
        Post post = postRepository.selectById(postId);
        if (post == null || post.getStatus() != 1) {
            throw new RuntimeException("动态不存在");
        }
        return convertToResponse(post, userId);
    }

    /**
     * 删除动态
     */
    @Transactional
    public void deletePost(Long userId, Long postId) {
        Post post = postRepository.selectById(postId);
        if (post == null || !post.getUserId().equals(userId)) {
            throw new RuntimeException("无权删除");
        }
        post.setStatus(0);
        postRepository.updateById(post);
    }

    /**
     * 点赞
     */
    @Transactional
    public void like(Long userId, Long postId) {
        // 检查是否已点赞
        String likeKey = "like:" + userId + ":" + postId;
        if (Boolean.TRUE.equals(redisTemplate.hasKey(likeKey))) {
            throw new RuntimeException("已点赞");
        }

        // 记录点赞
        LikeRecord record = new LikeRecord();
        record.setUserId(userId);
        record.setTargetType("post");
        record.setTargetId(postId);
        likeRecordRepository.insert(record);

        // 更新点赞数
        Post post = postRepository.selectById(postId);
        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.updateById(post);

        // 缓存点赞状态
        redisTemplate.opsForValue().set(likeKey, 1, 24, TimeUnit.HOURS);
    }

    /**
     * 取消点赞
     */
    @Transactional
    public void unlike(Long userId, Long postId) {
        LikeRecord record = likeRecordRepository.selectOne(
            new LambdaQueryWrapper<LikeRecord>()
                .eq(LikeRecord::getUserId, userId)
                .eq(LikeRecord::getTargetType, "post")
                .eq(LikeRecord::getTargetId, postId)
        );

        if (record != null) {
            likeRecordRepository.deleteById(record.getId());

            Post post = postRepository.selectById(postId);
            post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
            postRepository.updateById(post);
        }

        redisTemplate.delete("like:" + userId + ":" + postId);
    }

    /**
     * 收藏
     */
    @Transactional
    public void favorite(Long userId, Long postId) {
        Favorite existing = favoriteRepository.selectOne(
            new LambdaQueryWrapper<Favorite>()
                .eq(Favorite::getUserId, userId)
                .eq(Favorite::getPostId, postId)
        );

        if (existing != null) {
            throw new RuntimeException("已收藏");
        }

        Favorite favorite = new Favorite();
        favorite.setUserId(userId);
        favorite.setPostId(postId);
        favoriteRepository.insert(favorite);
    }

    /**
     * 取消收藏
     */
    @Transactional
    public void unfavorite(Long userId, Long postId) {
        favoriteRepository.delete(
            new LambdaQueryWrapper<Favorite>()
                .eq(Favorite::getUserId, userId)
                .eq(Favorite::getPostId, postId)
        );
    }

    /**
     * 获取收藏列表
     */
    public PageResponse<PostResponse> getFavorites(Long userId, Integer page, Integer pageSize) {
        Page<Favorite> favPage = new Page<>(page, pageSize);
        LambdaQueryWrapper<Favorite> favWrapper = new LambdaQueryWrapper<>();
        favWrapper.eq(Favorite::getUserId, userId)
            .orderByDesc(Favorite::getCreatedAt);
        Page<Favorite> favResult = favoriteRepository.selectPage(favPage, favWrapper);

        List<PostResponse> list = new ArrayList<>();
        for (Favorite fav : favResult.getRecords()) {
            Post post = postRepository.selectById(fav.getPostId());
            if (post != null && post.getStatus() == 1) {
                list.add(convertToResponse(post, userId));
            }
        }

        return PageResponse.of(list, favResult.getTotal(), (int) favResult.getCurrent(), (int) favResult.getSize());
    }

    /**
     * 增加浏览数
     */
    public void incrementViewCount(Long postId) {
        String viewKey = "post:view:" + postId;
        Long viewCount = redisTemplate.opsForValue().increment(viewKey);

        // 每10次浏览更新一次数据库
        if (viewCount != null && viewCount % 10 == 0) {
            Post post = postRepository.selectById(postId);
            if (post != null) {
                post.setViewCount(post.getViewCount() + 10);
                postRepository.updateById(post);
                // 重置 Redis 计数
                redisTemplate.opsForValue().set(viewKey, 0);
            }
        }
    }

    /**
     * 增加分享数
     */
    @Transactional
    public void incrementShareCount(Long postId) {
        Post post = postRepository.selectById(postId);
        if (post != null) {
            post.setShareCount(post.getShareCount() + 1);
            postRepository.updateById(post);
        }
    }

    private PostResponse convertToResponse(Post post, Long userId) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setUserId(post.getUserId());
        response.setContent(post.getContent());
        response.setType(post.getType());
        response.setLikeCount(post.getLikeCount());
        response.setCommentCount(post.getCommentCount());
        response.setShareCount(post.getShareCount());
        response.setViewCount(post.getViewCount());
        response.setLocation(post.getLocation());
        response.setMusicTitle(post.getMusicTitle());
        response.setCreatedAt(post.getCreatedAt().toString());

        // 解析媒体URLs
        if (post.getMediaUrls() != null) {
            response.setMediaUrls(JSON.parseArray(post.getMediaUrls(), String.class));
        }

        // 检查点赞状态
        String likeKey = "like:" + userId + ":" + post.getId();
        response.setIsLiked(Boolean.TRUE.equals(redisTemplate.hasKey(likeKey)));

        // 检查收藏状态
        Long favCount = favoriteRepository.selectCount(
            new LambdaQueryWrapper<Favorite>()
                .eq(Favorite::getUserId, userId)
                .eq(Favorite::getPostId, post.getId())
        );
        response.setIsFavorited(favCount > 0);

        return response;
    }
}