package com.heartmatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("conversation")
public class Conversation {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String uid;
    private Integer type;         // 1单聊 2群聊
    private String name;          // 群聊名称
    private String avatar;        // 群聊头像
    private Long lastMessageId;   // 最后一条消息ID
    private LocalDateTime lastMessageAt;  // 最后消息时间

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableLogic
    private LocalDateTime deletedAt;
}
