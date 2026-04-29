package com.heartmatch.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heartmatch.dto.RechargeRecordResponse;
import com.heartmatch.dto.WalletResponse;
import com.heartmatch.entity.RechargeRecord;
import com.heartmatch.entity.Wallet;
import com.heartmatch.repository.RechargeRecordRepository;
import com.heartmatch.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final RechargeRecordRepository rechargeRecordRepository;

    /**
     * 获取钱包信息
     */
    public WalletResponse getBalance(Long userId) {
        WalletResponse response = new WalletResponse();
        response.setBalance(BigDecimal.ZERO);
        response.setTotalRecharge(BigDecimal.ZERO);
        response.setVipLevel(0);
        response.setIsVip(false);

        Wallet wallet = walletRepository.selectOne(
                new LambdaQueryWrapper<Wallet>().eq(Wallet::getUserId, userId)
        );

        if (wallet != null) {
            response.setBalance(wallet.getBalance() != null ? wallet.getBalance() : BigDecimal.ZERO);
            response.setTotalRecharge(wallet.getTotalRecharge() != null ? wallet.getTotalRecharge() : BigDecimal.ZERO);
            response.setVipLevel(wallet.getVipLevel() != null ? wallet.getVipLevel() : 0);
            response.setVipExpireAt(wallet.getVipExpireAt());

            if (wallet.getVipLevel() != null && wallet.getVipLevel() > 0
                    && wallet.getVipExpireAt() != null && wallet.getVipExpireAt().isAfter(LocalDateTime.now())) {
                response.setIsVip(true);
            }
        }

        return response;
    }

    /**
     * 充值
     */
    @Transactional
    public RechargeRecord recharge(Long userId, BigDecimal amount, Integer payType) {
        // 获取或创建钱包
        Wallet wallet = walletRepository.selectOne(
                new LambdaQueryWrapper<Wallet>().eq(Wallet::getUserId, userId)
        );

        if (wallet == null) {
            wallet = new Wallet();
            wallet.setUserId(userId);
            wallet.setBalance(BigDecimal.ZERO);
            wallet.setTotalRecharge(BigDecimal.ZERO);
            wallet.setVipLevel(0);
            walletRepository.insert(wallet);
        }

        // 创建充值记录
        RechargeRecord record = new RechargeRecord();
        record.setUserId(userId);
        record.setAmount(amount);
        record.setPayType(payType);
        record.setStatus(1); // 已支付
        record.setOrderNo(generateOrderNo());
        record.setPaidAt(LocalDateTime.now());
        rechargeRecordRepository.insert(record);

        // 更新钱包余额
        wallet.setBalance(wallet.getBalance().add(amount));
        wallet.setTotalRecharge(wallet.getTotalRecharge().add(amount));
        walletRepository.updateById(wallet);

        return record;
    }

    /**
     * 获取充值记录
     */
    public List<RechargeRecordResponse> getRecords(Long userId, int page, int size) {
        Page<RechargeRecord> pageParam = new Page<>(page, size);

        LambdaQueryWrapper<RechargeRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RechargeRecord::getUserId, userId);
        wrapper.eq(RechargeRecord::getStatus, 1); // 只查询已支付的
        wrapper.orderByDesc(RechargeRecord::getCreatedAt);

        Page<RechargeRecord> result = rechargeRecordRepository.selectPage(pageParam, wrapper);

        return result.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 转换充值记录为响应DTO
     */
    private RechargeRecordResponse convertToResponse(RechargeRecord record) {
        RechargeRecordResponse response = new RechargeRecordResponse();
        response.setId(record.getId());
        response.setAmount(record.getAmount());
        response.setPayType(record.getPayType());
        response.setStatus(record.getStatus());
        response.setOrderNo(record.getOrderNo());
        response.setPaidAt(record.getPaidAt());
        response.setCreatedAt(record.getCreatedAt());
        return response;
    }

    /**
     * 生成订单号
     */
    private String generateOrderNo() {
        return "RC" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    /**
     * 扣除余额
     */
    @Transactional
    public boolean deductBalance(Long userId, BigDecimal amount) {
        Wallet wallet = walletRepository.selectOne(
                new LambdaQueryWrapper<Wallet>().eq(Wallet::getUserId, userId)
        );

        if (wallet == null || wallet.getBalance().compareTo(amount) < 0) {
            return false;
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.updateById(wallet);
        return true;
    }
}
