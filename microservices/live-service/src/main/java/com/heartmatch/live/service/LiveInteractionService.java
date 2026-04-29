package com.heartmatch.live.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.heartmatch.live.dto.BarrageRequest;
import com.heartmatch.live.dto.GiftRequest;
import com.heartmatch.live.entity.LiveBarrage;
import com.heartmatch.live.entity.LiveGift;
import com.heartmatch.live.entity.LiveGiftRecord;
import com.heartmatch.live.entity.LiveRoom;
import com.heartmatch.live.repository.LiveBarrageRepository;
import com.heartmatch.live.repository.LiveGiftRecordRepository;
import com.heartmatch.live.repository.LiveGiftRepository;
import com.heartmatch.live.repository.LiveRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LiveInteractionService {

    private final LiveRoomRepository liveRoomRepository;
    private final LiveBarrageRepository liveBarrageRepository;
    private final LiveGiftRepository liveGiftRepository;
    private final LiveGiftRecordRepository liveGiftRecordRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String LIVE_ROOM_VIEWER_KEY = "live:room:viewer:";
    private static final String LIVE_ROOM_LIKE_KEY = "live:room:like:";
    private static final String LIVE_ROOM_BARRAGE_KEY = "live:room:barrage:";

    /**
     * 进入直播间
     */
    public void joinRoom(Long roomId, Long userId) {
        LiveRoom room = liveRoomRepository.selectById(roomId);
        if (room == null) {
            throw new RuntimeException("直播间不存在");
        }
        if (room.getStatus() != 1) {
            throw new RuntimeException("直播间未在直播中");
        }

        String viewerKey = LIVE_ROOM_VIEWER_KEY + roomId;
        redisTemplate.opsForSet().add(viewerKey, userId.toString());
        redisTemplate.expire(viewerKey, 24, TimeUnit.HOURS);

        log.info("用户 {} 进入直播间 {}", userId, roomId);
    }

    /**
     * 离开直播间
     */
    public void leaveRoom(Long roomId, Long userId) {
        LiveRoom room = liveRoomRepository.selectById(roomId);
        if (room == null) {
            throw new RuntimeException("直播间不存在");
        }

        String viewerKey = LIVE_ROOM_VIEWER_KEY + roomId;
        redisTemplate.opsForSet().remove(viewerKey, userId.toString());

        log.info("用户 {} 离开直播间 {}", userId, roomId);
    }

    /**
     * 获取直播间观众数
     */
    public int getViewerCount(Long roomId) {
        String viewerKey = LIVE_ROOM_VIEWER_KEY + roomId;
        Long size = redisTemplate.opsForSet().size(viewerKey);
        return size != null ? size.intValue() : 0;
    }

    /**
     * 获取直播间观众列表
     */
    public List<Long> getViewers(Long roomId) {
        String viewerKey = LIVE_ROOM_VIEWER_KEY + roomId;
        Set<Object> members = redisTemplate.opsForSet().members(viewerKey);
        if (members == null || members.isEmpty()) {
            return Collections.emptyList();
        }
        return members.stream()
                .map(m -> Long.parseLong(m.toString()))
                .collect(Collectors.toList());
    }

    /**
     * 发送弹幕
     */
    @Transactional
    public LiveBarrage sendBarrage(Long roomId, Long userId, BarrageRequest request) {
        LiveRoom room = liveRoomRepository.selectById(roomId);
        if (room == null) {
            throw new RuntimeException("直播间不存在");
        }
        if (room.getStatus() != 1) {
            throw new RuntimeException("直播间未在直播中");
        }

        LiveBarrage barrage = new LiveBarrage();
        barrage.setRoomId(roomId);
        barrage.setUserId(userId);
        barrage.setContent(request.getContent());
        barrage.setCreatedAt(LocalDateTime.now());
        barrage.setDeleted(0);

        liveBarrageRepository.insert(barrage);

        // 缓存最近弹幕
        String barrageKey = LIVE_ROOM_BARRAGE_KEY + roomId;
        redisTemplate.opsForList().rightPush(barrageKey, barrage);
        redisTemplate.opsForList().trim(barrageKey, -100, -1); // 只保留最近100条

        return barrage;
    }

    /**
     * 获取弹幕历史
     */
    public List<LiveBarrage> getBarrageHistory(Long roomId, int limit) {
        String barrageKey = LIVE_ROOM_BARRAGE_KEY + roomId;
        List<Object> list = redisTemplate.opsForList().range(barrageKey, 0, limit - 1);
        if (list == null || list.isEmpty()) {
            // 从数据库获取
            LambdaQueryWrapper<LiveBarrage> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(LiveBarrage::getRoomId, roomId)
                    .orderByDesc(LiveBarrage::getCreatedAt)
                    .last("LIMIT " + limit);
            return liveBarrageRepository.selectList(wrapper);
        }
        return list.stream()
                .map(obj -> (LiveBarrage) obj)
                .collect(Collectors.toList());
    }

    /**
     * 送礼物
     */
    @Transactional
    public LiveGiftRecord sendGift(Long roomId, Long senderId, GiftRequest request) {
        LiveRoom room = liveRoomRepository.selectById(roomId);
        if (room == null) {
            throw new RuntimeException("直播间不存在");
        }
        if (room.getStatus() != 1) {
            throw new RuntimeException("直播间未在直播中");
        }

        LiveGift gift = liveGiftRepository.selectById(request.getGiftId());
        if (gift == null) {
            throw new RuntimeException("礼物不存在");
        }

        BigDecimal totalPrice = gift.getPrice().multiply(BigDecimal.valueOf(request.getGiftCount()));

        LiveGiftRecord record = new LiveGiftRecord();
        record.setRoomId(roomId);
        record.setSenderId(senderId);
        record.setReceiverId(room.getUserId());
        record.setGiftId(request.getGiftId());
        record.setGiftCount(request.getGiftCount());
        record.setTotalPrice(totalPrice);
        record.setCreatedAt(LocalDateTime.now());
        record.setDeleted(0);

        liveGiftRecordRepository.insert(record);

        // 更新直播间点赞数（用点赞数代替礼物特效显示）
        String likeKey = LIVE_ROOM_LIKE_KEY + roomId;
        redisTemplate.opsForValue().increment(likeKey, request.getGiftCount());

        log.info("用户 {} 在直播间 {} 赠送礼物 {} x{}", senderId, roomId, gift.getName(), request.getGiftCount());

        return record;
    }

    /**
     * 获取礼物列表
     */
    public List<LiveGift> getGiftList() {
        LambdaQueryWrapper<LiveGift> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(LiveGift::getStatus, 1)
                .orderByAsc(LiveGift::getPrice);
        return liveGiftRepository.selectList(wrapper);
    }

    /**
     * 获取直播间礼物记录
     */
    public List<LiveGiftRecord> getGiftRecords(Long roomId, int limit) {
        LambdaQueryWrapper<LiveGiftRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(LiveGiftRecord::getRoomId, roomId)
                .orderByDesc(LiveGiftRecord::getCreatedAt)
                .last("LIMIT " + limit);
        return liveGiftRecordRepository.selectList(wrapper);
    }

    /**
     * 点赞
     */
    public void addLike(Long roomId, Long userId) {
        LiveRoom room = liveRoomRepository.selectById(roomId);
        if (room == null || room.getStatus() != 1) {
            return;
        }

        String likeKey = LIVE_ROOM_LIKE_KEY + roomId;
        redisTemplate.opsForValue().increment(likeKey, 1);
    }
}
