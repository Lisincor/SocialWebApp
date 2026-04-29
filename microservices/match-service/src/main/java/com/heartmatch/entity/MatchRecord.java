package com.heartmatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("match_record")
public class MatchRecord {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;         // 用户ID
    private Long matchedUserId;   // 匹配的用户ID
    private Integer matchType;  // 1普通喜欢 2超级喜欢 3今日缘分
    private LocalDateTime createdAt;
}
