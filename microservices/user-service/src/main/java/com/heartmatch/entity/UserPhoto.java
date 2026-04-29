package com.heartmatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("user_photo")
public class UserPhoto {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;
    private String url;
    private Integer position;
    private Integer isAvatar;
    private Integer auditStatus;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}