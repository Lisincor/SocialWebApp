package com.heartmatch.controller;

import com.heartmatch.dto.ApiResponse;
import com.heartmatch.dto.LoginAccountRequest;
import com.heartmatch.dto.LoginSmsRequest;
import com.heartmatch.dto.RegisterSetInfoRequest;
import com.heartmatch.dto.SendCodeRequest;
import com.heartmatch.dto.TokenResponse;
import com.heartmatch.service.AuthService;
import com.heartmatch.service.UserService;
import com.heartmatch.dto.UserInfoResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    // ==================== 发送验证码 ====================

    @PostMapping("/send-code")
    public ApiResponse<Void> sendCode(@RequestBody SendCodeRequest request) {
        authService.sendCode(request.getPhone(), request.getType());
        return ApiResponse.success(null);
    }

    // ==================== 注册 ====================

    /**
     * 验证注册验证码（检查手机号是否可用）
     * POST /api/v1/auth/verify-register-code
     * Body: { phone, code }
     * 返回: { valid: true/false }
     */
    @PostMapping("/verify-register-code")
    public ApiResponse<Boolean> verifyRegisterCode(@RequestBody @Valid LoginSmsRequest request) {
        authService.verifyRegisterCode(request.getPhone(), request.getCode());
        return ApiResponse.success(true);
    }

    /**
     * 注册（设置账户名和密码）
     * POST /api/v1/auth/register
     * Body: { phone, code, username, password, nickname?, gender? }
     */
    @PostMapping("/register")
    public ApiResponse<TokenResponse> register(@RequestBody @Valid RegisterSetInfoRequest request) {
        Map<String, Object> result = authService.register(
            request.getPhone(),
            request.getCode(),
            request.getUsername(),
            request.getPassword(),
            request.getNickname(),
            request.getGender()
        );

        // 获取用户信息
        UserInfoResponse userInfo = userService.getCurrentUser((Long) result.get("userId"));
        Boolean isNewUser = (Boolean) result.get("isNewUser");

        TokenResponse response = new TokenResponse(
            (String) result.get("accessToken"),
            (String) result.get("refreshToken"),
            (Long) result.get("expiresIn"),
            userInfo,
            isNewUser
        );

        return ApiResponse.success(response);
    }

    // ==================== 登录 ====================

    /**
     * 账户密码登录
     * POST /api/v1/auth/login-account
     * Body: { username, password }
     */
    @PostMapping("/login-account")
    public ApiResponse<TokenResponse> loginByAccount(@RequestBody @Valid LoginAccountRequest request) {
        Map<String, Object> result = authService.loginByAccount(request.getUsername(), request.getPassword());

        UserInfoResponse userInfo = userService.getCurrentUser((Long) result.get("userId"));

        TokenResponse response = new TokenResponse(
            (String) result.get("accessToken"),
            (String) result.get("refreshToken"),
            (Long) result.get("expiresIn"),
            userInfo,
            false
        );

        return ApiResponse.success(response);
    }

    /**
     * 手机号验证码登录
     * POST /api/v1/auth/login-sms
     * Body: { phone, code }
     */
    @PostMapping("/login-sms")
    public ApiResponse<TokenResponse> loginBySms(@RequestBody @Valid LoginSmsRequest request) {
        Map<String, Object> result = authService.loginBySms(request.getPhone(), request.getCode());

        UserInfoResponse userInfo = userService.getCurrentUser((Long) result.get("userId"));

        TokenResponse response = new TokenResponse(
            (String) result.get("accessToken"),
            (String) result.get("refreshToken"),
            (Long) result.get("expiresIn"),
            userInfo,
            false
        );

        return ApiResponse.success(response);
    }

    // ==================== 密码管理 ====================

    /**
     * 修改密码
     */
    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody Map<String, String> request) {
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");
        authService.changePassword(userId, oldPassword, newPassword);
        return ApiResponse.success(null);
    }

    // ==================== Token管理 ====================

    @PostMapping("/refresh-token")
    public ApiResponse<String> refreshToken(@RequestHeader("Authorization") String authHeader,
                                            @RequestHeader("X-User-Id") Long userId) {
        String newToken = authService.refreshToken(authHeader, userId);
        return ApiResponse.success(newToken);
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestHeader("X-User-Id") Long userId) {
        authService.logout(userId);
        return ApiResponse.success(null);
    }
}
