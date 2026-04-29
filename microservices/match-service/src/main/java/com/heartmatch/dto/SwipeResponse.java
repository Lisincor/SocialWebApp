package com.heartmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SwipeResponse {
    private Boolean isMatched;          // 是否匹配
    private MatchUserResponse matchUser; // 匹配的用户信息（如果匹配）
    private Integer remainingLikes;      // 剩余喜欢次数
}
