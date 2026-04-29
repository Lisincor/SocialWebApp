package com.heartmatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("follow")
public class Follow {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long followerId;   // 关注者
    private Long followingId;  // 被关注者
    private Integer type;      // 1普通关注 2悄悄关注

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}