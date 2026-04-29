package com.heartmatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("story")
public class Story {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;
    private String mediaUrl;
    private String thumbnailUrl;
    private Integer duration;  // 时长(秒)
    private Integer viewCount;
    private LocalDateTime expireAt;  // 24小时后过期

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}