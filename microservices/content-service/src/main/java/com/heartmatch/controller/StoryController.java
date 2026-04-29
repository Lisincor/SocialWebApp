package com.heartmatch.controller;

import com.heartmatch.dto.ApiResponse;
import com.heartmatch.entity.Story;
import com.heartmatch.service.StoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stories")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;

    @GetMapping("/following")
    public ApiResponse<List<Story>> getFollowingStories(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam List<Long> followingIds) {
        List<Story> stories = storyService.getFollowingStories(followingIds);
        return ApiResponse.success(stories);
    }

    @GetMapping("/{id}")
    public ApiResponse<Story> getStoryById(@PathVariable Long id) {
        Story story = storyService.getStoryById(id);
        return ApiResponse.success(story);
    }

    @PostMapping
    public ApiResponse<Story> createStory(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody StoryRequest request) {
        Story story = storyService.createStory(
            userId, request.getMediaUrl(), request.getThumbnailUrl(), request.getDuration()
        );
        return ApiResponse.success("发布成功", story);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteStory(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        storyService.deleteStory(userId, id);
        return ApiResponse.success(null);
    }

    @PostMapping("/{id}/view")
    public ApiResponse<Void> markViewed(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        storyService.markViewed(userId, id);
        return ApiResponse.success(null);
    }
}

class StoryRequest {
    private String mediaUrl;
    private String thumbnailUrl;
    private Integer duration;

    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }
    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
}