package com.heartmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponse {
    private Long id;
    private String uid;
    private Integer type;           // 1单聊 2群聊
    private String name;
    private String avatar;
    private MessageResponse lastMessage;
    private LocalDateTime lastMessageAt;
    private Integer unreadCount;
    private Integer memberCount;
    private Boolean isMuted;
    private Boolean isPinned;
    private LocalDateTime createdAt;
}
