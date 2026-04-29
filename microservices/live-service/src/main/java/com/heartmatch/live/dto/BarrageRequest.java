package com.heartmatch.live.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BarrageRequest {

    @NotBlank(message = "弹幕内容不能为空")
    @Size(max = 100, message = "弹幕内容不能超过100字")
    private String content;
}
