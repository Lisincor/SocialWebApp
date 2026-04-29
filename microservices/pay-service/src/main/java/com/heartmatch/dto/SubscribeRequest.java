package com.heartmatch.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubscribeRequest {
    @NotNull(message = "产品类型不能为空")
    private Integer productType;

    @NotNull(message = "支付方式不能为空")
    private Integer payType;
}
