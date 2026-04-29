package com.heartmatch.controller;

import com.heartmatch.dto.ApiResponse;
import com.heartmatch.dto.UpdateProfileRequest;
import com.heartmatch.dto.UserInfoResponse;
import com.heartmatch.dto.PageResponse;
import com.heartmatch.service.UserService;
import com.heartmatch.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final FollowService followService;

    @GetMapping("/me")
    public ApiResponse<UserInfoResponse> getCurrentUser(@RequestHeader("X-User-Id") Long userId) {
        UserInfoResponse userInfo = userService.getCurrentUser(userId);
        userInfo.setFollowerCount(followService.getFollowerCount(userId));
        userInfo.setFollowingCount(followService.getFollowingCount(userId));
        return ApiResponse.success(userInfo);
    }

    @PutMapping("/me")
    public ApiResponse<UserInfoResponse> updateProfile(@RequestHeader("X-User-Id") Long userId,
                                                       @RequestBody UpdateProfileRequest request) {
        userService.updateProfile(userId, request);
        // 返回更新后的完整用户信息
        UserInfoResponse userInfo = userService.getCurrentUser(userId);
        userInfo.setFollowerCount(followService.getFollowerCount(userId));
        userInfo.setFollowingCount(followService.getFollowingCount(userId));
        return ApiResponse.success(userInfo);
    }

    @GetMapping("/{uid}")
    public ApiResponse<UserInfoResponse> getUserByUid(@PathVariable("uid") String uid) {
        UserInfoResponse userInfo = userService.getUserByUid(uid);
        return ApiResponse.success(userInfo);
    }

    @PutMapping("/me/avatar")
    public ApiResponse<String> uploadAvatar(@RequestHeader("X-User-Id") Long userId,
                                             @RequestBody Map<String, String> body) {
        String avatarUrl = body.get("url");
        if (avatarUrl == null || avatarUrl.isEmpty()) {
            throw new RuntimeException("头像URL不能为空");
        }
        String resultUrl = userService.uploadAvatar(userId, avatarUrl);
        return ApiResponse.success(resultUrl);
    }

    @PutMapping("/me/photos")
    public ApiResponse<String> uploadPhoto(@RequestHeader("X-User-Id") Long userId,
                                          @RequestBody java.util.Map<String, Object> body) {
        String url = (String) body.get("url");
        Integer position = body.get("position") != null ? (Integer) body.get("position") : null;
        String photoUrl = userService.uploadPhoto(userId, url, position);
        return ApiResponse.success(photoUrl);
    }

    @DeleteMapping("/me/photos/{photoId}")
    public ApiResponse<Void> deletePhoto(@RequestHeader("X-User-Id") Long userId,
                                         @PathVariable Long photoId) {
        userService.deletePhoto(userId, photoId);
        return ApiResponse.success(null);
    }

    @GetMapping("/me/photos")
    public ApiResponse<List<String>> getMyPhotos(@RequestHeader("X-User-Id") Long userId) {
        List<String> photos = userService.getUserPhotos(userId);
        return ApiResponse.success(photos);
    }

    @GetMapping("/search")
    public ApiResponse<List<UserInfoResponse>> searchUsers(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam String keyword) {
        List<UserInfoResponse> users = userService.searchUsers(keyword, userId);
        return ApiResponse.success(users);
    }

    @GetMapping("/{uid}/followers")
    public ApiResponse<PageResponse<UserInfoResponse>> getFollowers(@PathVariable String uid) {
        // TODO: 实现获取粉丝列表
        return ApiResponse.success(PageResponse.of(List.of(), 0L, 1, 20));
    }

    @GetMapping("/{uid}/followings")
    public ApiResponse<PageResponse<UserInfoResponse>> getFollowings(@PathVariable String uid) {
        // TODO: 实现获取关注列表
        return ApiResponse.success(PageResponse.of(List.of(), 0L, 1, 20));
    }

    /**
     * 内部接口：获取用户基本信息（昵称、头像）
     * 供其他微服务调用
     */
    @GetMapping("/internal/{userId}/basic")
    public ApiResponse<Map<String, String>> getUserBasicInfo(@PathVariable("userId") Long userId) {
        Map<String, String> userInfo = userService.getUserBasicInfo(userId);
        return ApiResponse.success(userInfo);
    }
}