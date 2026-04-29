package com.heartmatch.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heartmatch.dto.ApiResponse;
import com.heartmatch.dto.MessageRequest;
import com.heartmatch.dto.MessageResponse;
import com.heartmatch.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    /**
     * 获取消息列表
     */
    @GetMapping("/conversations/{id}/messages")
    public ApiResponse<Page<MessageResponse>> getMessages(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        if (userId == null) {
            userId = 1L; // 临时处理
        }
        Page<MessageResponse> messages = messageService.getMessages(userId, id, page, size);
        return ApiResponse.success(messages);
    }

    /**
     * 发送消息
     */
    @PostMapping("/messages")
    public ApiResponse<MessageResponse> sendMessage(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody MessageRequest request) {
        if (userId == null) {
            userId = 1L; // 临时处理
        }
        try {
            MessageResponse message = messageService.sendMessage(userId, request);
            return ApiResponse.success(message);
        } catch (RuntimeException e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }

    /**
     * 标记消息已读
     */
    @PutMapping("/messages/{id}/read")
    public ApiResponse<Void> markAsRead(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long id) {
        if (userId == null) {
            userId = 1L; // 临时处理
        }
        try {
            // 需要通过消息ID获取会话ID
            messageService.markMessageAsRead(userId, id);
            return ApiResponse.success(null);
        } catch (RuntimeException e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }

    /**
     * 撤回消息
     */
    @DeleteMapping("/messages/{id}")
    public ApiResponse<Void> recallMessage(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long id) {
        if (userId == null) {
            userId = 1L; // 临时处理
        }
        try {
            messageService.recallMessage(userId, id);
            return ApiResponse.success(null);
        } catch (RuntimeException e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }

    /**
     * 焚毁消息
     */
    @PostMapping("/messages/{id}/burn")
    public ApiResponse<Void> burnMessage(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long id) {
        if (userId == null) {
            userId = 1L; // 临时处理
        }
        try {
            messageService.burnMessage(userId, id);
            return ApiResponse.success(null);
        } catch (RuntimeException e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }
}
