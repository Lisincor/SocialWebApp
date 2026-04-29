package com.heartmatch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class LoginRequest {
    // 登录方式: "sms" 验证码登录, "password" 密码登录
    private String loginType = "sms";

    // 手机号（必填）
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

    // 验证码登录
    private String code;

    // 密码登录
    private String password;

    // 新用户注册信息
    private String nickname;
    private Integer gender;
}
