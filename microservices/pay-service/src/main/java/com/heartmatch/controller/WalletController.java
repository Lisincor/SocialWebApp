package com.heartmatch.controller;

import com.heartmatch.common.ApiResponse;
import com.heartmatch.dto.RechargeRecordResponse;
import com.heartmatch.dto.RechargeRequest;
import com.heartmatch.dto.WalletResponse;
import com.heartmatch.entity.RechargeRecord;
import com.heartmatch.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    /**
     * 获取余额
     * GET /api/v1/wallet/balance
     */
    @GetMapping("/balance")
    public ApiResponse<WalletResponse> getBalance(@RequestHeader("X-User-Id") Long userId) {
        WalletResponse wallet = walletService.getBalance(userId);
        return ApiResponse.success(wallet);
    }

    /**
     * 充值
     * POST /api/v1/wallet/recharge
     */
    @PostMapping("/recharge")
    public ApiResponse<RechargeRecord> recharge(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody RechargeRequest request) {
        RechargeRecord record = walletService.recharge(userId, request.getAmount(), request.getPayType());
        return ApiResponse.success("充值成功", record);
    }

    /**
     * 获取交易记录
     * GET /api/v1/wallet/records
     */
    @GetMapping("/records")
    public ApiResponse<List<RechargeRecordResponse>> getRecords(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<RechargeRecordResponse> records = walletService.getRecords(userId, page, size);
        return ApiResponse.success(records);
    }
}
