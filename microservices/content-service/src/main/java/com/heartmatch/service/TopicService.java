package com.heartmatch.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heartmatch.entity.Topic;
import com.heartmatch.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * 获取话题列表
     */
    public List<Topic> getTopics(String keyword, Integer page, Integer pageSize) {
        LambdaQueryWrapper<Topic> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Topic::getStatus, 1)
            .orderByDesc(Topic::getHotScore);

        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(Topic::getName, keyword);
        }

        Page<Topic> topicPage = new Page<>(page, pageSize);
        Page<Topic> result = topicRepository.selectPage(topicPage, wrapper);
        return result.getRecords();
    }

    /**
     * 获取热门话题
     */
    public List<Topic> getTrendingTopics(Integer limit) {
        LambdaQueryWrapper<Topic> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Topic::getStatus, 1)
            .orderByDesc(Topic::getHotScore)
            .last("LIMIT " + limit);
        return topicRepository.selectList(wrapper);
    }

    /**
     * 根据ID获取话题
     */
    public Topic getTopicById(Long topicId) {
        return topicRepository.selectById(topicId);
    }

    /**
     * 关注话题
     */
    public void followTopic(Long userId, Long topicId) {
        String key = "topic:follow:" + topicId + ":" + userId;
        redisTemplate.opsForSet().add("topic:followers:" + topicId, userId);
        redisTemplate.opsForValue().set(key, 1);

        // 更新话题关注数
        Topic topic = topicRepository.selectById(topicId);
        if (topic != null) {
            topic.setFollowCount(topic.getFollowCount() + 1);
            topicRepository.updateById(topic);
        }
    }

    /**
     * 取消关注话题
     */
    public void unfollowTopic(Long userId, Long topicId) {
        String key = "topic:follow:" + topicId + ":" + userId;
        redisTemplate.delete(key);
        redisTemplate.opsForSet().remove("topic:followers:" + topicId, userId);
    }

    /**
     * 检查是否关注话题
     */
    public boolean isFollowingTopic(Long userId, Long topicId) {
        String key = "topic:follow:" + topicId + ":" + userId;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
}