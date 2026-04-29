package com.heartmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RechargeRecordResponse {
    private Long id;
    private BigDecimal amount;
    private Integer payType;
    private Integer status;
    private String orderNo;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
}
