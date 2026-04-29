package com.heartmatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("like_record")
public class LikeRecord {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;
    private String targetType;  // post, comment
    private Long targetId;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}