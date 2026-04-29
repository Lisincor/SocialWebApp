package com.heartmatch.dto;

import lombok.Data;

@Data
public class PageRequest {
    private Integer page = 1;
    private Integer pageSize = 20;
}