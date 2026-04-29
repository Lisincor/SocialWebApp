package com.heartmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VipProductResponse {
    private Integer id;
    private String name;
    private BigDecimal price;
    private Integer duration;
    private List<String> features;
}
