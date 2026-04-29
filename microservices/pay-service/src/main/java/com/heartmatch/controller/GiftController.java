package com.heartmatch.controller;

import com.heartmatch.common.ApiResponse;
import com.heartmatch.dto.GiftResponse;
import com.heartmatch.service.GiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/gifts")
@RequiredArgsConstructor
public class GiftController {

    private final GiftService giftService;

    /**
     * 获取礼物列表
     * GET /api/v1/gifts
     */
    @GetMapping
    public ApiResponse<List<GiftResponse>> getGifts() {
        List<GiftResponse> gifts = giftService.getGifts();
        // 如果数据库为空，返回默认礼物列表
        if (gifts == null || gifts.isEmpty()) {
            gifts = giftService.getDefaultGifts();
        }
        return ApiResponse.success(gifts);
    }
}
