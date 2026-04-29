package com.heartmatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("user_profile")
public class UserProfile {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;
    private Integer height;
    private Integer weight;
    private String job;
    private String income;
    private String education;
    private String school;
    private String city;
    private Double longitude;
    private Double latitude;
    private Integer marriage;
    private Integer smoking;
    private Integer drinking;
    private String hometown;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}