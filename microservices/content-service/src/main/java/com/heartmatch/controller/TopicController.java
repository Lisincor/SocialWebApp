package com.heartmatch.controller;

import com.heartmatch.dto.ApiResponse;
import com.heartmatch.entity.Topic;
import com.heartmatch.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @GetMapping
    public ApiResponse<List<Topic>> getTopics(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        List<Topic> topics = topicService.getTopics(category, page, pageSize);
        return ApiResponse.success(topics);
    }

    @GetMapping("/{id}")
    public ApiResponse<Topic> getTopicById(@PathVariable Long id) {
        Topic topic = topicService.getTopicById(id);
        return ApiResponse.success(topic);
    }

    @GetMapping("/trending")
    public ApiResponse<List<Topic>> getTrendingTopics(
            @RequestParam(defaultValue = "10") Integer limit) {
        List<Topic> topics = topicService.getTrendingTopics(limit);
        return ApiResponse.success(topics);
    }

    @PostMapping("/{id}/follow")
    public ApiResponse<Void> followTopic(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        topicService.followTopic(userId, id);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}/follow")
    public ApiResponse<Void> unfollowTopic(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        topicService.unfollowTopic(userId, id);
        return ApiResponse.success(null);
    }
}