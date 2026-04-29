package com.heartmatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {
    private Long conversationId;
    private Integer type;          // 1文字 2图片 3语音 4视频
    private String content;        // 消息内容
    private String mediaUrl;       // 媒体URL
    private Integer duration;      // 音视频时长(秒)
    private Boolean burnAfterRead; // 阅后即焚
}
