package com.heartmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private Long id;
    private Long conversationId;
    private Long senderId;
    private String senderName;
    private String senderAvatar;
    private Integer type;
    private String content;
    private String mediaUrl;
    private Integer duration;
    private Boolean burnAfterRead;
    private Boolean isRecalled;
    private Boolean isSelf;         // 是否是自己发送的
    private Integer status;         // 1发送中 2已发送 3已读 4已撤回 5已焚毁
    private LocalDateTime createdAt;
}
