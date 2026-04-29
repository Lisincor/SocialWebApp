package com.heartmatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("user")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String uid;
    private String phone;
    private String username;     // 账户名（唯一，用于账号密码登录）
    private String password;     // 密码
    private String nickname;     // 昵称（展示用）
    private String avatar;
    private Integer gender;      // 0未知 1男 2女
    private LocalDate birthday;
    private String bio;
    private Integer status;      // 1正常 2禁用
    private Integer vipLevel;    // 0普通 1月度 2年度
    private LocalDateTime vipExpireAt;
    private LocalDateTime lastActiveAt;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
