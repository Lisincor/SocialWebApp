package com.heartmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GiftResponse {
    private Long id;
    private String name;
    private String icon;
    private BigDecimal price;
    private String effect;
}
