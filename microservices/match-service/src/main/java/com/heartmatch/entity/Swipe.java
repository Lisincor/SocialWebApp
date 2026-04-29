package com.heartmatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("swipe_record")
public class Swipe {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;          // 滑动者ID
    private Long targetUserId;   // 被滑动者ID
    private Integer action;     // 1喜欢 2跳过 3超级喜欢
    private LocalDateTime createdAt;
}
