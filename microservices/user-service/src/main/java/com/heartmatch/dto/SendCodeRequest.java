package com.heartmatch.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendCodeRequest {
    @NotBlank(message = "手机号不能为空")
    private String phone;
    private Integer type = 1;  // 1登录 2注册
}