package com.heartmatch.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.heartmatch.dto.GiftResponse;
import com.heartmatch.entity.Gift;
import com.heartmatch.repository.GiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GiftService {

    private final GiftRepository giftRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String GIFT_CACHE_KEY = "gifts:list";

    /**
     * 获取礼物列表
     */
    public List<GiftResponse> getGifts() {
        // 先从Redis缓存获取
        @SuppressWarnings("unchecked")
        List<GiftResponse> cachedGifts = (List<GiftResponse>) redisTemplate.opsForValue().get(GIFT_CACHE_KEY);
        if (cachedGifts != null) {
            return cachedGifts;
        }

        // 从数据库获取
        LambdaQueryWrapper<Gift> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Gift::getStatus, 1); // 上架状态
        wrapper.orderByAsc(Gift::getPrice);

        List<GiftResponse> gifts = giftRepository.selectList(wrapper).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        // 缓存5分钟
        redisTemplate.opsForValue().set(GIFT_CACHE_KEY, gifts, 5, TimeUnit.MINUTES);

        return gifts;
    }

    /**
     * 发送礼物
     */
    public boolean sendGift(Long senderId, Long receiverId, Long giftId, BigDecimal price) {
        // 这里可以添加更复杂的业务逻辑
        // 例如：记录礼物发送、触发通知等
        return true;
    }

    /**
     * 获取默认礼物列表（当数据库为空时使用）
     */
    public List<GiftResponse> getDefaultGifts() {
        return List.of(
                createGift(1L, "小花", "🌸", new BigDecimal("1.00"), "撒花"),
                createGift(2L, "爱心", "❤️", new BigDecimal("5.00"), "红心满天飞"),
                createGift(3L, "玫瑰", "🌹", new BigDecimal("10.00"), "玫瑰雨"),
                createGift(4L, "钻戒", "💍", new BigDecimal("52.00"), "钻石闪耀"),
                createGift(5L, "火箭", "🚀", new BigDecimal("100.00"), "火箭升空"),
                createGift(6L, "城堡", "🏰", new BigDecimal("520.00"), "梦幻城堡")
        );
    }

    private GiftResponse createGift(Long id, String name, String icon, BigDecimal price, String effect) {
        return new GiftResponse(id, name, icon, price, effect);
    }

    /**
     * 转换实体为响应DTO
     */
    private GiftResponse convertToResponse(Gift gift) {
        return new GiftResponse(
                gift.getId(),
                gift.getName(),
                gift.getIcon(),
                gift.getPrice(),
                gift.getEffect()
        );
    }

    /**
     * 清除礼物缓存
     */
    public void clearCache() {
        redisTemplate.delete(GIFT_CACHE_KEY);
    }
}
