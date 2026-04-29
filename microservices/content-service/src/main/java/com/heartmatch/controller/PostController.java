package com.heartmatch.controller;

import com.heartmatch.dto.ApiResponse;
import com.heartmatch.dto.PostRequest;
import com.heartmatch.dto.PostResponse;
import com.heartmatch.dto.PageResponse;
import com.heartmatch.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping("/feed")
    public ApiResponse<PageResponse<PostResponse>> getFeed(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "recommend") String feedType,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        PageResponse<PostResponse> feed = postService.getFeed(userId, feedType, page, pageSize);
        return ApiResponse.success(feed);
    }

    @GetMapping("/{id}")
    public ApiResponse<PostResponse> getPostById(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        PostResponse post = postService.getPostById(id, userId);
        return ApiResponse.success(post);
    }

    @PostMapping
    public ApiResponse<PostResponse> createPost(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody PostRequest request) {
        PostResponse post = postService.createPost(userId, request);
        return ApiResponse.success("发布成功", post);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deletePost(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        postService.deletePost(userId, id);
        return ApiResponse.success(null);
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<PageResponse<PostResponse>> getUserPosts(
            @RequestHeader("X-User-Id") Long currentUserId,
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        PageResponse<PostResponse> posts = postService.getUserPosts(currentUserId, userId, page, pageSize);
        return ApiResponse.success(posts);
    }

    @PostMapping("/{id}/like")
    public ApiResponse<Void> like(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        postService.like(userId, id);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}/like")
    public ApiResponse<Void> unlike(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        postService.unlike(userId, id);
        return ApiResponse.success(null);
    }

    @PostMapping("/{id}/favorite")
    public ApiResponse<Void> favorite(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        postService.favorite(userId, id);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}/favorite")
    public ApiResponse<Void> unfavorite(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        postService.unfavorite(userId, id);
        return ApiResponse.success(null);
    }

    @GetMapping("/favorites")
    public ApiResponse<PageResponse<PostResponse>> getFavorites(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        PageResponse<PostResponse> favorites = postService.getFavorites(userId, page, pageSize);
        return ApiResponse.success(favorites);
    }

    @PostMapping("/{id}/view")
    public ApiResponse<Void> view(@PathVariable Long id) {
        postService.incrementViewCount(id);
        return ApiResponse.success(null);
    }

    @PostMapping("/{id}/share")
    public ApiResponse<Void> share(@PathVariable Long id) {
        postService.incrementShareCount(id);
        return ApiResponse.success(null);
    }
}