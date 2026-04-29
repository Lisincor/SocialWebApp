package com.heartmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateConversationRequest {
    private Integer type;           // 1单聊 2群聊
    private String name;            // 群聊名称(群聊必填)
    private List<Long> memberIds;   // 成员ID列表
}
