package com.heartmatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("wallet")
public class Wallet {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private BigDecimal balance;

    private BigDecimal totalRecharge;

    /**
     * VIP等级: 0=普通用户, 1=月卡VIP, 2=年卡VIP
     */
    private Integer vipLevel;

    private LocalDateTime vipExpireAt;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableLogic
    private LocalDateTime deletedAt;
}
