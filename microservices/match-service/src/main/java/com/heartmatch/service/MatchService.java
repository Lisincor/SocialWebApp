package com.heartmatch.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heartmatch.dto.MatchUserResponse;
import com.heartmatch.dto.SwipeRequest;
import com.heartmatch.dto.SwipeResponse;
import com.heartmatch.entity.MatchRecord;
import com.heartmatch.entity.Swipe;
import com.heartmatch.repository.MatchRecordRepository;
import com.heartmatch.repository.SwipeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchService {

    private final SwipeRepository swipeRepository;
    private final MatchRecordRepository matchRecordRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    // 每日喜欢次数限制
    private static final int DAILY_LIKE_LIMIT = 100;
    private static final int SUPER_LIKE_LIMIT = 10;

    /**
     * 获取推荐用户列表
     */
    public List<MatchUserResponse> getRecommendations(Long userId, int page, int size) {
        // 获取用户已滑动过的用户ID
        Set<Long> swipedIds = getSwipedUserIds(userId);
        swipedIds.add(userId); // 排除自己

        // 模拟推荐算法 - 实际应调用用户服务获取推荐
        // 这里生成模拟数据
        List<MatchUserResponse> recommendations = new ArrayList<>();
        Random random = new Random();

        for (int i = 0; i < size; i++) {
            Long targetId = (long) (1000 + random.nextInt(9000));
            if (swipedIds.contains(targetId)) continue;

            MatchUserResponse user = new MatchUserResponse();
            user.setId((long) (i + 1));
            user.setUid(targetId);
            user.setNickname("用户" + targetId);
            user.setAvatar("https://picsum.photos/200");
            user.setGender(random.nextInt(2) + 1);
            user.setAge(20 + random.nextInt(15));
            user.setCity(getRandomCity());
            user.setMatchScore(60 + random.nextDouble() * 40);
            user.setInterests("音乐,旅行,美食");
            recommendations.add(user);
        }

        return recommendations;
    }

    /**
     * 处理滑动操作
     */
    @Transactional
    public SwipeResponse handleSwipe(Long userId, SwipeRequest request) {
        Long targetUserId = request.getTargetUserId();
        Integer action = request.getAction();

        // 检查是否重复滑动
        QueryWrapper<Swipe> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId)
                    .eq("target_user_id", targetUserId);
        if (swipeRepository.selectCount(queryWrapper) > 0) {
            return new SwipeResponse(false, null, getRemainingLikes(userId));
        }

        // 记录滑动
        Swipe swipe = new Swipe();
        swipe.setUserId(userId);
        swipe.setTargetUserId(targetUserId);
        swipe.setAction(action);
        swipe.setCreatedAt(LocalDateTime.now());
        swipeRepository.insert(swipe);

        // 如果是跳过，直接返回
        if (action == 2) {
            return new SwipeResponse(false, null, getRemainingLikes(userId));
        }

        // 检查是否匹配
        boolean isMatched = checkMutualLike(userId, targetUserId, action);

        if (isMatched) {
            // 创建匹配记录
            MatchRecord matchRecord = new MatchRecord();
            matchRecord.setUserId(Math.min(userId, targetUserId));
            matchRecord.setMatchedUserId(Math.max(userId, targetUserId));
            matchRecord.setMatchType(action == 3 ? 2 : 1); // 超级喜欢或普通喜欢
            matchRecord.setCreatedAt(LocalDateTime.now());
            matchRecordRepository.insert(matchRecord);

            // 构建匹配用户信息（实际应调用用户服务）
            MatchUserResponse matchUser = buildMatchUserResponse(targetUserId);
            return new SwipeResponse(true, matchUser, getRemainingLikes(userId));
        }

        return new SwipeResponse(false, null, getRemainingLikes(userId));
    }

    /**
     * 检查是否互相喜欢
     */
    private boolean checkMutualLike(Long userId, Long targetUserId, Integer myAction) {
        // 如果是超级喜欢，直接检查对方是否喜欢过我
        if (myAction == 3) {
            QueryWrapper<Swipe> query = new QueryWrapper<>();
            query.eq("user_id", targetUserId)
                 .eq("target_user_id", userId)
                 .in("action", 1, 3); // 对方喜欢我或超级喜欢我
            return swipeRepository.selectCount(query) > 0;
        }

        // 普通喜欢：检查对方是否也喜欢我
        QueryWrapper<Swipe> query = new QueryWrapper<>();
        query.eq("user_id", targetUserId)
             .eq("target_user_id", userId)
             .in("action", 1, 3);
        return swipeRepository.selectCount(query) > 0;
    }

    /**
     * 获取匹配列表
     */
    public List<MatchUserResponse> getMatches(Long userId) {
        // 获取所有与该用户相关的匹配记录
        QueryWrapper<MatchRecord> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId)
                    .or()
                    .eq("matched_user_id", userId)
                    .orderByDesc("created_at");

        List<MatchRecord> matchRecords = matchRecordRepository.selectList(queryWrapper);

        // 提取匹配的用户ID
        List<Long> matchedUserIds = matchRecords.stream()
                .map(record -> record.getUserId().equals(userId) ? record.getMatchedUserId() : record.getUserId())
                .collect(Collectors.toList());

        // 构建返回结果（实际应调用用户服务）
        return matchedUserIds.stream()
                .map(this::buildMatchUserResponse)
                .collect(Collectors.toList());
    }

    /**
     * 今日缘分 - 随机配对
     */
    @Transactional
    public MatchUserResponse todayLuck(Long userId) {
        // 检查今日是否已经使用过
        String todayKey = "today_luck:" + userId + ":" + LocalDate.now();
        if (Boolean.TRUE.equals(redisTemplate.hasKey(todayKey))) {
            Object cached = redisTemplate.opsForValue().get(todayKey);
            if (cached instanceof MatchUserResponse) {
                return (MatchUserResponse) cached;
            }
        }

        // 获取所有未匹配过的用户
        Set<Long> swipedIds = getSwipedUserIds(userId);
        swipedIds.add(userId);

        // 随机选择一个用户作为今日缘分
        Random random = new Random();
        Long luckyUserId = (long) (1000 + random.nextInt(9000));

        // 创建今日缘分匹配记录
        MatchRecord matchRecord = new MatchRecord();
        matchRecord.setUserId(Math.min(userId, luckyUserId));
        matchRecord.setMatchedUserId(Math.max(userId, luckyUserId));
        matchRecord.setMatchType(3); // 今日缘分
        matchRecord.setCreatedAt(LocalDateTime.now());
        matchRecordRepository.insert(matchRecord);

        MatchUserResponse luckyUser = buildMatchUserResponse(luckyUserId);
        luckyUser.setMatchScore(100.0); // 今日缘分100%匹配

        // 缓存到今天结束
        long secondsUntilMidnight = java.time.temporal.ChronoUnit.SECONDS.between(
                LocalDateTime.now(),
                LocalDate.now().plusDays(1).atStartOfDay()
        );
        redisTemplate.opsForValue().set(todayKey, luckyUser, secondsUntilMidnight, TimeUnit.SECONDS);

        return luckyUser;
    }

    /**
     * 获取用户已滑动过的用户ID集合
     */
    private Set<Long> getSwipedUserIds(Long userId) {
        QueryWrapper<Swipe> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("target_user_id").eq("user_id", userId);
        return swipeRepository.selectList(queryWrapper).stream()
                .map(Swipe::getTargetUserId)
                .collect(Collectors.toSet());
    }

    /**
     * 获取剩余喜欢次数
     */
    public int getRemainingLikes(Long userId) {
        String key = "daily_likes:" + userId + ":" + LocalDate.now();
        Integer used = (Integer) redisTemplate.opsForValue().get(key);
        if (used == null) {
            used = 0;
        }
        return DAILY_LIKE_LIMIT - used;
    }

    /**
     * 使用一次喜欢次数
     */
    private void useLike(Long userId, boolean isSuperLike) {
        String key = "daily_likes:" + userId + ":" + LocalDate.now();
        redisTemplate.opsForValue().increment(key);

        // 设置过期时间为当天结束
        long secondsUntilMidnight = java.time.temporal.ChronoUnit.SECONDS.between(
                LocalDateTime.now(),
                LocalDate.now().plusDays(1).atStartOfDay()
        );
        redisTemplate.expire(key, secondsUntilMidnight, TimeUnit.SECONDS);
    }

    /**
     * 构建匹配用户响应
     */
    private MatchUserResponse buildMatchUserResponse(Long uid) {
        Random random = new Random();
        MatchUserResponse user = new MatchUserResponse();
        user.setId(uid);
        user.setUid(uid);
        user.setNickname("用户" + uid);
        user.setAvatar("https://picsum.photos/200");
        user.setGender(random.nextInt(2) + 1);
        user.setAge(22 + random.nextInt(10));
        user.setCity(getRandomCity());
        user.setMatchScore(70 + random.nextDouble() * 30);
        user.setInterests("音乐,旅行,美食,电影");
        return user;
    }

    /**
     * 获取随机城市
     */
    private String getRandomCity() {
        String[] cities = {"北京", "上海", "广州", "深圳", "杭州", "成都", "武汉", "西安", "南京", "重庆"};
        return cities[new Random().nextInt(cities.length)];
    }
}
