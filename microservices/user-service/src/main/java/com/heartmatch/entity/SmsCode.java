package com.heartmatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("sms_code")
public class SmsCode {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String phone;
    private String code;
    private Integer type;  // 1登录 2注册
    private Integer used;
    private LocalDateTime expireAt;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}