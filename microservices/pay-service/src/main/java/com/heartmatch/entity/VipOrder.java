package com.heartmatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("vip_order")
public class VipOrder {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    /**
     * 产品类型: 1=月卡, 2=年卡
     */
    private Integer productType;

    private BigDecimal price;

    /**
     * 支付方式: 1=微信, 2=支付宝, 3=苹果内购
     */
    private Integer payType;

    /**
     * 订单状态: 0=待支付, 1=已支付, 2=已取消, 3=已退款
     */
    private Integer status;

    private String orderNo;

    private LocalDateTime paidAt;

    private LocalDateTime expiredAt;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableLogic
    private LocalDateTime deletedAt;
}
