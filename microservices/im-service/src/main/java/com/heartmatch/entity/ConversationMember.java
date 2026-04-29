package com.heartmatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("conversation_member")
public class ConversationMember {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long conversationId;
    private Long userId;
    private Integer role;          // 1普通成员 2管理员 3群主
    private LocalDateTime lastReadAt;  // 最后阅读时间
    private Boolean isMuted;       // 是否静音
    private Boolean isPinned;      // 是否置顶

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableLogic
    private LocalDateTime deletedAt;
}
