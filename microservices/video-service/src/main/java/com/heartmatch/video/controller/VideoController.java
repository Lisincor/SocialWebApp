package com.heartmatch.video.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heartmatch.video.dto.ApiResponse;
import com.heartmatch.video.dto.VideoRequest;
import com.heartmatch.video.dto.VideoResponse;
import com.heartmatch.video.service.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reels")
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;

    /**
     * GET /api/v1/reels/feed - 推荐视频流
     */
    @GetMapping("/feed")
    public ApiResponse<Page<VideoResponse>> getFeed(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<VideoResponse> feed = videoService.getFeed(userId, page, size);
        return ApiResponse.success(feed);
    }

    /**
     * GET /api/v1/reels/{id} - 视频详情
     */
    @GetMapping("/{id}")
    public ApiResponse<VideoResponse> getVideoDetail(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {

        VideoResponse video = videoService.getVideoDetail(id, userId);
        return ApiResponse.success(video);
    }

    /**
     * POST /api/v1/reels - 上传视频
     */
    @PostMapping
    public ApiResponse<VideoResponse> uploadVideo(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody VideoRequest request) {

        VideoResponse video = videoService.uploadVideo(userId, request);
        return ApiResponse.success("Video uploaded successfully", video);
    }

    /**
     * DELETE /api/v1/reels/{id} - 删除视频
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Boolean> deleteVideo(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {

        boolean deleted = videoService.deleteVideo(id, userId);
        return ApiResponse.success("Video deleted successfully", deleted);
    }

    /**
     * POST /api/v1/reels/{id}/like - 点赞
     */
    @PostMapping("/{id}/like")
    public ApiResponse<Boolean> likeVideo(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "true") boolean liked) {

        boolean result;
        if (liked) {
            result = videoService.likeVideo(userId, id);
        } else {
            result = videoService.unlikeVideo(userId, id);
        }
        return ApiResponse.success(result);
    }

    /**
     * POST /api/v1/reels/{id}/view - 播放统计
     */
    @PostMapping("/{id}/view")
    public ApiResponse<Void> recordView(@PathVariable Long id) {
        videoService.recordView(id);
        return ApiResponse.success(null);
    }

    /**
     * POST /api/v1/reels/{id}/duet - 合拍
     */
    @PostMapping("/{id}/duet")
    public ApiResponse<VideoResponse> duet(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody VideoRequest request) {

        VideoResponse video = videoService.duet(userId, id, request);
        return ApiResponse.success("Duet created successfully", video);
    }
}