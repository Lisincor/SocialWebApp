package com.heartmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VipStatusResponse {
    private Boolean isVip;
    private Integer vipLevel;
    private LocalDateTime vipExpireAt;
    private Long remainingDays;
}
