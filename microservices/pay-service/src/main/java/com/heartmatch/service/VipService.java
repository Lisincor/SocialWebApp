package com.heartmatch.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.heartmatch.dto.VipProductResponse;
import com.heartmatch.dto.VipStatusResponse;
import com.heartmatch.entity.VipOrder;
import com.heartmatch.entity.Wallet;
import com.heartmatch.repository.VipOrderRepository;
import com.heartmatch.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VipService {

    private final VipOrderRepository vipOrderRepository;
    private final WalletRepository walletRepository;

    /**
     * 获取VIP产品列表
     */
    public List<VipProductResponse> getProducts() {
        VipProductResponse monthly = new VipProductResponse();
        monthly.setId(1);
        monthly.setName("月卡");
        monthly.setPrice(new BigDecimal("25.00"));
        monthly.setDuration(30);
        monthly.setFeatures(Arrays.asList(
                "无限喜欢",
                "查看谁喜欢我",
                "每日超级喜欢 x3",
                "隐藏在线状态",
                "去广告"
        ));

        VipProductResponse yearly = new VipProductResponse();
        yearly.setId(2);
        yearly.setName("年卡");
        yearly.setPrice(new BigDecimal("198.00"));
        yearly.setDuration(365);
        yearly.setFeatures(Arrays.asList(
                "无限喜欢",
                "查看谁喜欢我",
                "每日超级喜欢 x10",
                "隐藏在线状态",
                "去广告",
                "优先推荐",
                "专属标识",
                "优先客服"
        ));

        return Arrays.asList(monthly, yearly);
    }

    /**
     * 订阅VIP
     */
    @Transactional
    public VipOrder subscribe(Long userId, Integer productType, Integer payType) {
        BigDecimal price = getProductPrice(productType);
        int duration = getProductDuration(productType);

        // 创建订单
        VipOrder order = new VipOrder();
        order.setUserId(userId);
        order.setProductType(productType);
        order.setPrice(price);
        order.setPayType(payType);
        order.setStatus(1); // 已支付
        order.setOrderNo(generateOrderNo());
        order.setPaidAt(LocalDateTime.now());
        order.setExpiredAt(LocalDateTime.now().plusDays(duration));
        vipOrderRepository.insert(order);

        // 更新钱包VIP状态
        updateWalletVipStatus(userId, productType, duration);

        return order;
    }

    /**
     * 获取VIP状态
     */
    public VipStatusResponse getStatus(Long userId) {
        VipStatusResponse response = new VipStatusResponse();
        response.setIsVip(false);
        response.setVipLevel(0);
        response.setVipExpireAt(null);
        response.setRemainingDays(0L);

        Wallet wallet = walletRepository.selectOne(
                new LambdaQueryWrapper<Wallet>().eq(Wallet::getUserId, userId)
        );

        if (wallet != null && wallet.getVipLevel() != null && wallet.getVipLevel() > 0) {
            LocalDateTime now = LocalDateTime.now();
            if (wallet.getVipExpireAt() != null && wallet.getVipExpireAt().isAfter(now)) {
                response.setIsVip(true);
                response.setVipLevel(wallet.getVipLevel());
                response.setVipExpireAt(wallet.getVipExpireAt());
                response.setRemainingDays(ChronoUnit.DAYS.between(now, wallet.getVipExpireAt()));
            }
        }

        return response;
    }

    /**
     * 获取产品价格
     */
    private BigDecimal getProductPrice(Integer productType) {
        if (productType == 1) {
            return new BigDecimal("25.00");
        } else if (productType == 2) {
            return new BigDecimal("198.00");
        }
        throw new IllegalArgumentException("无效的产品类型");
    }

    /**
     * 获取产品时长(天)
     */
    private int getProductDuration(Integer productType) {
        if (productType == 1) {
            return 30;
        } else if (productType == 2) {
            return 365;
        }
        throw new IllegalArgumentException("无效的产品类型");
    }

    /**
     * 更新钱包VIP状态
     */
    private void updateWalletVipStatus(Long userId, Integer productType, int duration) {
        Wallet wallet = walletRepository.selectOne(
                new LambdaQueryWrapper<Wallet>().eq(Wallet::getUserId, userId)
        );

        if (wallet == null) {
            wallet = new Wallet();
            wallet.setUserId(userId);
            wallet.setBalance(BigDecimal.ZERO);
            wallet.setTotalRecharge(BigDecimal.ZERO);
            wallet.setVipLevel(productType);
            wallet.setVipExpireAt(LocalDateTime.now().plusDays(duration));
            walletRepository.insert(wallet);
        } else {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime newExpireAt;

            if (wallet.getVipExpireAt() != null && wallet.getVipExpireAt().isAfter(now)) {
                // 叠加时长
                newExpireAt = wallet.getVipExpireAt().plusDays(duration);
            } else {
                // 从当前开始计算
                newExpireAt = now.plusDays(duration);
            }

            // 年卡优先级高于月卡
            if (productType == 2 || wallet.getVipLevel() == null || wallet.getVipLevel() < productType) {
                wallet.setVipLevel(productType);
            }

            wallet.setVipExpireAt(newExpireAt);
            walletRepository.updateById(wallet);
        }
    }

    /**
     * 生成订单号
     */
    private String generateOrderNo() {
        return "VIP" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
