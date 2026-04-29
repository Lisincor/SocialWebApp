package com.heartmatch.controller;

import com.heartmatch.dto.ApiResponse;
import com.heartmatch.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @PostMapping("/{uid}")
    public ApiResponse<Void> follow(@RequestHeader("X-User-Id") Long userId,
                                   @PathVariable String uid) {
        // TODO: 根据uid获取用户id
        Long targetUserId = Long.parseLong(uid.replace("u", ""));
        followService.follow(userId, targetUserId);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{uid}")
    public ApiResponse<Void> unfollow(@RequestHeader("X-User-Id") Long userId,
                                     @PathVariable String uid) {
        Long targetUserId = Long.parseLong(uid.replace("u", ""));
        followService.unfollow(userId, targetUserId);
        return ApiResponse.success(null);
    }

    @GetMapping("/me/followers")
    public ApiResponse<Object> getMyFollowers(@RequestHeader("X-User-Id") Long userId) {
        Long count = followService.getFollowerCount(userId);
        return ApiResponse.success(count);
    }

    @GetMapping("/me/followings")
    public ApiResponse<Object> getMyFollowings(@RequestHeader("X-User-Id") Long userId) {
        Long count = followService.getFollowingCount(userId);
        return ApiResponse.success(count);
    }
}