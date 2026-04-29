package com.heartmatch.live.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("live_gift_record")
public class LiveGiftRecord {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long roomId;

    private Long senderId;

    private Long receiverId;

    private Long giftId;

    private Integer giftCount;

    private BigDecimal totalPrice;

    private LocalDateTime createdAt;

    private Integer deleted;
}
