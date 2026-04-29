package com.heartmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class PageResponse<T> {
    private List<T> list;
    private Long total;
    private Integer page;
    private Integer pageSize;

    public static <T> PageResponse<T> of(List<T> list, Long total, Integer page, Integer pageSize) {
        return new PageResponse<>(list, total, page, pageSize);
    }
}