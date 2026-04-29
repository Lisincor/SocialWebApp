package com.heartmatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("user_auth")
public class UserAuth {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;
    private Integer realNameAuth;  // 实名认证
    private String realName;
    private Integer educationAuth;  // 学历认证
    private String educationSchool;
    private Integer jobAuth;  // 职业认证
    private Integer assetAuth;  // 资产认证

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}