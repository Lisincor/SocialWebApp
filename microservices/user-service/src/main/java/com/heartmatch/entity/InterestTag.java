package com.heartmatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("interest_tag")
public class InterestTag {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;
    private String category;
    private Integer hotScore;
    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}