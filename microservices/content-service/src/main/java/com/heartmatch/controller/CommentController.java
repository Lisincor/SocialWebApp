package com.heartmatch.controller;

import com.heartmatch.dto.ApiResponse;
import com.heartmatch.dto.CommentRequest;
import com.heartmatch.dto.CommentResponse;
import com.heartmatch.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/posts/{postId}/comments")
    public ApiResponse<List<CommentResponse>> getComments(
            @PathVariable Long postId,
            @RequestHeader("X-User-Id") Long userId) {
        List<CommentResponse> comments = commentService.getComments(postId, userId);
        return ApiResponse.success(comments);
    }

    @PostMapping("/posts/{postId}/comments")
    public ApiResponse<CommentResponse> createComment(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long postId,
            @RequestBody CommentRequest request) {
        CommentResponse comment = commentService.createComment(userId, postId, request);
        return ApiResponse.success("评论成功", comment);
    }

    @PutMapping("/comments/{id}")
    public ApiResponse<Void> updateComment(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id,
            @RequestBody CommentRequest request) {
        // TODO: 实现更新评论
        return ApiResponse.success(null);
    }

    @DeleteMapping("/comments/{id}")
    public ApiResponse<Void> deleteComment(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        commentService.deleteComment(userId, id);
        return ApiResponse.success(null);
    }

    @PostMapping("/comments/{id}/like")
    public ApiResponse<Void> likeComment(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        commentService.likeComment(userId, id);
        return ApiResponse.success(null);
    }
}