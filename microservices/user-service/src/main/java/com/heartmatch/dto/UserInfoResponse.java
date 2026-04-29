package com.heartmatch.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserInfoResponse {
    private Long id;
    private String uid;
    private String phone;
    private String nickname;
    private String avatar;
    private Integer gender;
    private LocalDate birthday;
    private String bio;
    private Integer vipLevel;
    private LocalDateTime vipExpireAt;

    // Profile
    private Integer height;
    private Integer weight;
    private String job;
    private String income;
    private String education;
    private String school;
    private String city;
    private String hometown;
    private Double longitude;
    private Double latitude;

    // Auth
    private Integer realNameAuth;
    private Integer educationAuth;
    private Integer jobAuth;
    private Integer assetAuth;

    // Stats
    private Long followerCount;
    private Long followingCount;
    private Long postCount;

    // Photos
    private List<String> photos;

    // Interests
    private List<String> interests;

    private LocalDateTime lastActiveAt;
}