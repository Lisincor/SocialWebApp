package com.heartmatch.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.heartmatch.entity.Story;
import com.heartmatch.repository.StoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * 获取关注者的故事
     */
    public List<Story> getFollowingStories(List<Long> followingIds) {
        if (followingIds == null || followingIds.isEmpty()) {
            return List.of();
        }

        LambdaQueryWrapper<Story> wrapper = new LambdaQueryWrapper<>();
        wrapper.in(Story::getUserId, followingIds)
            .gt(Story::getExpireAt, LocalDateTime.now())
            .orderByDesc(Story::getCreatedAt);

        return storyRepository.selectList(wrapper);
    }

    /**
     * 发布故事
     */
    @Transactional
    public Story createStory(Long userId, String mediaUrl, String thumbnailUrl, Integer duration) {
        Story story = new Story();
        story.setUserId(userId);
        story.setMediaUrl(mediaUrl);
        story.setThumbnailUrl(thumbnailUrl);
        story.setDuration(duration != null ? duration : 15);
        story.setViewCount(0);
        story.setExpireAt(LocalDateTime.now().plusHours(24));
        storyRepository.insert(story);
        return story;
    }

    /**
     * 删除故事
     */
    @Transactional
    public void deleteStory(Long userId, Long storyId) {
        Story story = storyRepository.selectById(storyId);
        if (story == null || !story.getUserId().equals(userId)) {
            throw new RuntimeException("无权删除");
        }
        storyRepository.deleteById(storyId);
    }

    /**
     * 标记故事已观看
     */
    public void markViewed(Long userId, Long storyId) {
        String key = "story:view:" + storyId + ":" + userId;
        if (!Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
            redisTemplate.opsForValue().set(key, 1, 24, TimeUnit.HOURS);

            Story story = storyRepository.selectById(storyId);
            if (story != null) {
                story.setViewCount(story.getViewCount() + 1);
                storyRepository.updateById(story);
            }
        }
    }

    /**
     * 获取单个故事
     */
    public Story getStoryById(Long storyId) {
        return storyRepository.selectById(storyId);
    }

    /**
     * 检查是否已观看
     */
    public boolean isViewed(Long userId, Long storyId) {
        String key = "story:view:" + storyId + ":" + userId;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
}