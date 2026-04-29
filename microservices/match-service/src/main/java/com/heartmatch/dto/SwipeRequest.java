package com.heartmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SwipeRequest {
    private Long targetUserId;  // 被滑动用户ID
    private Integer action;     // 1喜欢 2跳过 3超级喜欢
}
