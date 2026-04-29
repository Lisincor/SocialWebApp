package com.heartmatch.controller;

import com.heartmatch.dto.ApiResponse;
import com.heartmatch.dto.ConversationResponse;
import com.heartmatch.dto.CreateConversationRequest;
import com.heartmatch.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    /**
     * 获取会话列表
     */
    @GetMapping
    public ApiResponse<List<ConversationResponse>> getConversations(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        if (userId == null) {
            // 实际应从JWT token获取用户ID
            userId = 1L; // 临时处理
        }
        List<ConversationResponse> conversations = conversationService.getConversations(userId);
        return ApiResponse.success(conversations);
    }

    /**
     * 创建会话
     */
    @PostMapping
    public ApiResponse<ConversationResponse> createConversation(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody CreateConversationRequest request) {
        if (userId == null) {
            userId = 1L; // 临时处理
        }
        ConversationResponse conversation = conversationService.createConversation(userId, request);
        return ApiResponse.success(conversation);
    }

    /**
     * 获取会话详情
     */
    @GetMapping("/{id}")
    public ApiResponse<ConversationResponse> getConversation(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long id) {
        if (userId == null) {
            userId = 1L; // 临时处理
        }
        ConversationResponse conversation = conversationService.getConversation(userId, id);
        if (conversation == null) {
            return ApiResponse.error(404, "会话不存在");
        }
        return ApiResponse.success(conversation);
    }

    /**
     * 标记会话已读
     */
    @PutMapping("/{id}/read")
    public ApiResponse<Void> markAsRead(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long id) {
        if (userId == null) {
            userId = 1L; // 临时处理
        }
        conversationService.markAsRead(userId, id);
        return ApiResponse.success(null);
    }
}
