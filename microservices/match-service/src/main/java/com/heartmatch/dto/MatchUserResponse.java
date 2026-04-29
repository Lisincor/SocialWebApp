package com.heartmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchUserResponse {
    private Long id;
    private Long uid;
    private String nickname;
    private String avatar;
    private Integer gender;     // 1男 2女
    private Integer age;
    private String city;
    private Double matchScore;  // 匹配分
    private String interests;   // 兴趣标签，逗号分隔
}
