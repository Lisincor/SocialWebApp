package com.heartmatch.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String nickname;
    private String avatar;
    private String bio;

    private String birthday;
    private Integer gender;

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
}