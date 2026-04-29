package com.heartmatch.live.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("live_barrage")
public class LiveBarrage {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long roomId;

    private Long userId;

    private String content;

    private LocalDateTime createdAt;

    private Integer deleted;
}
