package com.heartmatch.live.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GiftRequest {

    @NotNull(message = "礼物ID不能为空")
    private Long giftId;

    @NotNull(message = "礼物数量不能为空")
    @Min(value = 1, message = "礼物数量最少为1")
    private Integer giftCount;
}
