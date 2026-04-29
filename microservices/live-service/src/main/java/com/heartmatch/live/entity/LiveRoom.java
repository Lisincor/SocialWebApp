package com.heartmatch.live.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("live_room")
public class LiveRoom {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private String title;

    private String coverUrl;

    /**
     * 直播类型: 1-普通直播 2-红娘直播 3-相亲直播
     */
    private Integer type;

    /**
     * 直播状态: 0-未开播 1-直播中 2-已结束
     */
    private Integer status;

    private Integer viewerCount;

    private Integer likeCount;

    private String streamUrl;

    private LocalDateTime startedAt;

    private LocalDateTime endedAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Integer deleted;
}
