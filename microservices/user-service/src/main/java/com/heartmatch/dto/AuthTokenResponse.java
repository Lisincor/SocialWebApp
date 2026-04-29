package com.heartmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthTokenResponse {
    private String accessToken;
    private String refreshToken;
    private Long expiresIn;
    private UserInfoResponse userInfo;
    private Boolean isNewUser;
}
