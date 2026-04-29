package com.heartmatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("gift")
public class Gift {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String icon;

    private BigDecimal price;

    private String effect;

    /**
     * 礼物状态: 0=下架, 1=上架
     */
    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableLogic
    private LocalDateTime deletedAt;
}
