package com.heartmatch.live.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;

@Data
@TableName("live_gift")
public class LiveGift {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String icon;

    private BigDecimal price;

    /**
     * 礼物特效描述
     */
    private String effect;

    private Integer deleted;

    private Integer status;
}
