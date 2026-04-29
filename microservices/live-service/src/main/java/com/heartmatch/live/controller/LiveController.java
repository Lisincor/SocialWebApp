package com.heartmatch.live.controller;

import com.heartmatch.live.dto.ApiResponse;
import com.heartmatch.live.dto.BarrageRequest;
import com.heartmatch.live.dto.CreateLiveRequest;
import com.heartmatch.live.dto.GiftRequest;
import com.heartmatch.live.dto.LiveRoomResponse;
import com.heartmatch.live.entity.LiveBarrage;
import com.heartmatch.live.entity.LiveGift;
import com.heartmatch.live.entity.LiveGiftRecord;
import com.heartmatch.live.service.LiveInteractionService;
import com.heartmatch.live.service.LiveRoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/lives")
@RequiredArgsConstructor
public class LiveController {

    private final LiveRoomService liveRoomService;
    private final LiveInteractionService liveInteractionService;

    /**
     * 获取直播列表
     */
    @GetMapping
    public ApiResponse<List<LiveRoomResponse>> getLiveList(
            @RequestParam(required = false) Integer type,
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "20") int pageSize) {
        List<LiveRoomResponse> list = liveRoomService.getLiveList(type, pageNum, pageSize);
        return ApiResponse.success(list);
    }

    /**
     * 获取直播详情
     */
    @GetMapping("/{id}")
    public ApiResponse<LiveRoomResponse> getLiveDetail(@PathVariable Long id) {
        LiveRoomResponse room = liveRoomService.getRoomDetail(id);
        return ApiResponse.success(room);
    }

    /**
     * 创建直播
     */
    @PostMapping
    public ApiResponse<LiveRoomResponse> createLive(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody CreateLiveRequest request) {
        LiveRoomResponse room = liveRoomService.createRoom(userId, request);
        return ApiResponse.success("创建成功", room);
    }

    /**
     * 开始直播
     */
    @PutMapping("/{id}/start")
    public ApiResponse<LiveRoomResponse> startLive(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        LiveRoomResponse room = liveRoomService.startLive(id, userId);
        return ApiResponse.success("开播成功", room);
    }

    /**
     * 结束直播
     */
    @PutMapping("/{id}/end")
    public ApiResponse<LiveRoomResponse> endLive(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        LiveRoomResponse room = liveRoomService.endLive(id, userId);
        return ApiResponse.success("直播已结束", room);
    }

    /**
     * 进入直播间
     */
    @PostMapping("/{id}/join")
    public ApiResponse<Void> joinRoom(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        liveInteractionService.joinRoom(id, userId);
        return ApiResponse.success("进入成功", null);
    }

    /**
     * 离开直播间
     */
    @PostMapping("/{id}/leave")
    public ApiResponse<Void> leaveRoom(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        liveInteractionService.leaveRoom(id, userId);
        return ApiResponse.success("已离开", null);
    }

    /**
     * 发送弹幕
     */
    @PostMapping("/{id}/comment")
    public ApiResponse<LiveBarrage> sendComment(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody BarrageRequest request) {
        LiveBarrage barrage = liveInteractionService.sendBarrage(id, userId, request);
        return ApiResponse.success(barrage);
    }

    /**
     * 送礼物
     */
    @PostMapping("/{id}/gift")
    public ApiResponse<LiveGiftRecord> sendGift(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody GiftRequest request) {
        LiveGiftRecord record = liveInteractionService.sendGift(id, userId, request);
        return ApiResponse.success("送礼成功", record);
    }

    /**
     * 获取礼物列表
     */
    @GetMapping("/gifts")
    public ApiResponse<List<LiveGift>> getGiftList() {
        List<LiveGift> gifts = liveInteractionService.getGiftList();
        return ApiResponse.success(gifts);
    }

    /**
     * 获取弹幕历史
     */
    @GetMapping("/{id}/comments")
    public ApiResponse<List<LiveBarrage>> getComments(
            @PathVariable Long id,
            @RequestParam(defaultValue = "50") int limit) {
        List<LiveBarrage> comments = liveInteractionService.getBarrageHistory(id, limit);
        return ApiResponse.success(comments);
    }

    /**
     * 获取观众列表
     */
    @GetMapping("/{id}/viewers")
    public ApiResponse<List<Long>> getViewers(@PathVariable Long id) {
        List<Long> viewers = liveInteractionService.getViewers(id);
        return ApiResponse.success(viewers);
    }

    /**
     * 点赞
     */
    @PostMapping("/{id}/like")
    public ApiResponse<Void> like(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        liveInteractionService.addLike(id, userId);
        return ApiResponse.success("点赞成功", null);
    }
}
