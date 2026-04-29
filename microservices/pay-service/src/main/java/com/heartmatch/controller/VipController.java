package com.heartmatch.controller;

import com.heartmatch.common.ApiResponse;
import com.heartmatch.dto.VipProductResponse;
import com.heartmatch.dto.VipStatusResponse;
import com.heartmatch.dto.SubscribeRequest;
import com.heartmatch.entity.VipOrder;
import com.heartmatch.service.VipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vip")
@RequiredArgsConstructor
public class VipController {

    private final VipService vipService;

    /**
     * 获取VIP产品列表
     * GET /api/v1/vip/products
     */
    @GetMapping("/products")
    public ApiResponse<List<VipProductResponse>> getProducts() {
        List<VipProductResponse> products = vipService.getProducts();
        return ApiResponse.success(products);
    }

    /**
     * 订阅VIP
     * POST /api/v1/vip/subscribe
     */
    @PostMapping("/subscribe")
    public ApiResponse<VipOrder> subscribe(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody SubscribeRequest request) {
        VipOrder order = vipService.subscribe(userId, request.getProductType(), request.getPayType());
        return ApiResponse.success("订阅成功", order);
    }

    /**
     * 获取VIP状态
     * GET /api/v1/vip/status
     */
    @GetMapping("/status")
    public ApiResponse<VipStatusResponse> getStatus(@RequestHeader("X-User-Id") Long userId) {
        VipStatusResponse status = vipService.getStatus(userId);
        return ApiResponse.success(status);
    }
}
