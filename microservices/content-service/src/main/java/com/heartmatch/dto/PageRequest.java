package com.heartmatch.dto;

import lombok.Data;
import java.util.List;

@Data
public class PageRequest {
    private Integer page = 1;
    private Integer pageSize = 20;
    private String feedType;  // following, recommend, nearby
}