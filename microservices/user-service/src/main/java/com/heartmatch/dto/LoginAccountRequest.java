package com.heartmatch.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginAccountRequest {
    @NotBlank(message = "账户名不能为空")
    private String username;

    @NotBlank(message = "密码不能为空")
    private String password;
}
