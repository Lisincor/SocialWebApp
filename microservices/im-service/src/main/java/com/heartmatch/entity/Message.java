package com.heartmatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("message")
public class Message {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String uid;
    private Long conversationId;
    private Long senderId;
    private Integer type;          // 1文字 2图片 3语音 4视频
    private String content;        // 消息内容
    private String mediaUrl;       // 媒体URL
    private Integer duration;      // 音视频时长(秒)
    private Boolean burnAfterRead; // 阅后即焚
    private Boolean isRecalled;     // 是否已撤回
    private LocalDateTime readAt;  // 已读时间
    private LocalDateTime burnedAt; // 焚毁时间

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableLogic
    private LocalDateTime deletedAt;
}
