package com.heartmatch.controller;

import com.heartmatch.dto.ApiResponse;
import com.heartmatch.dto.MatchUserResponse;
import com.heartmatch.dto.SwipeRequest;
import com.heartmatch.dto.SwipeResponse;
import com.heartmatch.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    /**
     * 获取推荐用户列表
     * GET /api/v1/matches/recommend
     */
    @GetMapping("/recommend")
    public ApiResponse<List<MatchUserResponse>> getRecommendations(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (userId == null) {
            return ApiResponse.error(401, "未登录");
        }
        List<MatchUserResponse> recommendations = matchService.getRecommendations(userId, page, size);
        return ApiResponse.success(recommendations);
    }

    /**
     * 处理滑动操作
     * POST /api/v1/matches/swipe
     */
    @PostMapping("/swipe")
    public ApiResponse<SwipeResponse> handleSwipe(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody SwipeRequest request) {
        if (userId == null) {
            return ApiResponse.error(401, "未登录");
        }
        if (request.getTargetUserId() == null || request.getAction() == null) {
            return ApiResponse.error(400, "参数错误");
        }
        if (request.getAction() < 1 || request.getAction() > 3) {
            return ApiResponse.error(400, "action必须为1(喜欢)2(跳过)3(超级喜欢)");
        }
        SwipeResponse response = matchService.handleSwipe(userId, request);
        return ApiResponse.success(response);
    }

    /**
     * 获取匹配列表
     * GET /api/v1/matches
     */
    @GetMapping
    public ApiResponse<List<MatchUserResponse>> getMatches(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        if (userId == null) {
            return ApiResponse.error(401, "未登录");
        }
        List<MatchUserResponse> matches = matchService.getMatches(userId);
        return ApiResponse.success(matches);
    }

    /**
     * 今日缘分 - 随机配对
     * POST /api/v1/matches/today-luck
     */
    @PostMapping("/today-luck")
    public ApiResponse<MatchUserResponse> todayLuck(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        if (userId == null) {
            return ApiResponse.error(401, "未登录");
        }
        MatchUserResponse luckyUser = matchService.todayLuck(userId);
        return ApiResponse.success("今日缘分已开启", luckyUser);
    }

    /**
     * 获取剩余喜欢次数
     * GET /api/v1/matches/likes/remaining
     */
    @GetMapping("/likes/remaining")
    public ApiResponse<Integer> getRemainingLikes(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        if (userId == null) {
            return ApiResponse.error(401, "未登录");
        }
        int remaining = matchService.getRemainingLikes(userId);
        return ApiResponse.success(remaining);
    }
}
