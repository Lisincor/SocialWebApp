package com.heartmatch.live.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heartmatch.live.dto.CreateLiveRequest;
import com.heartmatch.live.dto.LiveRoomResponse;
import com.heartmatch.live.entity.LiveRoom;
import com.heartmatch.live.repository.LiveRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LiveRoomService {

    private final LiveRoomRepository liveRoomRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String LIVE_ROOM_VIEWER_KEY = "live:room:viewer:";
    private static final String LIVE_ROOM_LIKE_KEY = "live:room:like:";

    /**
     * 创建直播间
     */
    @Transactional
    public LiveRoomResponse createRoom(Long userId, CreateLiveRequest request) {
        LiveRoom room = new LiveRoom();
        room.setUserId(userId);
        room.setTitle(request.getTitle());
        room.setCoverUrl(request.getCoverUrl());
        room.setType(request.getType());
        room.setStatus(0); // 未开播
        room.setViewerCount(0);
        room.setLikeCount(0);
        room.setCreatedAt(LocalDateTime.now());
        room.setUpdatedAt(LocalDateTime.now());
        room.setDeleted(0);

        liveRoomRepository.insert(room);
        return convertToResponse(room);
    }

    /**
     * 开始直播
     */
    @Transactional
    public LiveRoomResponse startLive(Long roomId, Long userId) {
        LiveRoom room = liveRoomRepository.selectById(roomId);
        if (room == null) {
            throw new RuntimeException("直播间不存在");
        }
        if (!room.getUserId().equals(userId)) {
            throw new RuntimeException("无权限操作");
        }
        if (room.getStatus() == 1) {
            throw new RuntimeException("直播间已在直播中");
        }

        room.setStatus(1); // 直播中
        room.setStartedAt(LocalDateTime.now());
        room.setUpdatedAt(LocalDateTime.now());
        room.setViewerCount(0);
        room.setLikeCount(0);

        liveRoomRepository.updateById(room);
        return convertToResponse(room);
    }

    /**
     * 结束直播
     */
    @Transactional
    public LiveRoomResponse endLive(Long roomId, Long userId) {
        LiveRoom room = liveRoomRepository.selectById(roomId);
        if (room == null) {
            throw new RuntimeException("直播间不存在");
        }
        if (!room.getUserId().equals(userId)) {
            throw new RuntimeException("无权限操作");
        }
        if (room.getStatus() != 1) {
            throw new RuntimeException("直播间未在直播中");
        }

        room.setStatus(2); // 已结束
        room.setEndedAt(LocalDateTime.now());
        room.setUpdatedAt(LocalDateTime.now());
        room.setViewerCount(0);

        liveRoomRepository.updateById(room);

        // 清理Redis缓存
        redisTemplate.delete(LIVE_ROOM_VIEWER_KEY + roomId);
        redisTemplate.delete(LIVE_ROOM_LIKE_KEY + roomId);

        return convertToResponse(room);
    }

    /**
     * 获取直播间详情
     */
    public LiveRoomResponse getRoomDetail(Long roomId) {
        LiveRoom room = liveRoomRepository.selectById(roomId);
        if (room == null) {
            throw new RuntimeException("直播间不存在");
        }

        LiveRoomResponse response = convertToResponse(room);

        // 从Redis获取实时观众数
        Long viewerCount = redisTemplate.opsForSet().size(LIVE_ROOM_VIEWER_KEY + roomId);
        response.setViewerCount(viewerCount != null ? viewerCount.intValue() : room.getViewerCount());

        // 从Redis获取实时点赞数
        Object likeCountObj = redisTemplate.opsForValue().get(LIVE_ROOM_LIKE_KEY + roomId);
        if (likeCountObj != null) {
            response.setLikeCount(Integer.parseInt(likeCountObj.toString()));
        }

        return response;
    }

    /**
     * 获取直播列表
     */
    public List<LiveRoomResponse> getLiveList(Integer type, int pageNum, int pageSize) {
        LambdaQueryWrapper<LiveRoom> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(LiveRoom::getStatus, 1) // 只获取直播中的
                .eq(type != null, LiveRoom::getType, type)
                .orderByDesc(LiveRoom::getViewerCount)
                .orderByDesc(LiveRoom::getStartedAt);

        Page<LiveRoom> page = new Page<>(pageNum, pageSize);
        liveRoomRepository.selectPage(page, wrapper);

        return page.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 获取用户创建的直播间
     */
    public LiveRoomResponse getUserRoom(Long userId) {
        LambdaQueryWrapper<LiveRoom> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(LiveRoom::getUserId, userId)
                .eq(LiveRoom::getStatus, 1)
                .orderByDesc(LiveRoom::getCreatedAt)
                .last("LIMIT 1");

        LiveRoom room = liveRoomRepository.selectOne(wrapper);
        if (room == null) {
            return null;
        }
        return convertToResponse(room);
    }

    private LiveRoomResponse convertToResponse(LiveRoom room) {
        LiveRoomResponse response = new LiveRoomResponse();
        response.setId(room.getId());
        response.setUserId(room.getUserId());
        response.setTitle(room.getTitle());
        response.setCoverUrl(room.getCoverUrl());
        response.setType(room.getType());
        response.setStatus(room.getStatus());
        response.setViewerCount(room.getViewerCount());
        response.setLikeCount(room.getLikeCount());
        response.setStreamUrl(room.getStreamUrl());
        response.setStartedAt(room.getStartedAt());
        return response;
    }
}
