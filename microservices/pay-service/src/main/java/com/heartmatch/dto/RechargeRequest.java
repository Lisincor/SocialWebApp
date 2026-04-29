package com.heartmatch.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RechargeRequest {
    @NotNull(message = "充值金额不能为空")
    @Positive(message = "充值金额必须大于0")
    private BigDecimal amount;

    @NotNull(message = "支付方式不能为空")
    private Integer payType;
}
