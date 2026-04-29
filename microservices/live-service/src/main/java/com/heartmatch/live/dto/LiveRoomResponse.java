package com.heartmatch.live.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LiveRoomResponse {

    private Long id;
    private Long userId;
    private String nickname;
    private String avatar;
    private String title;
    private String coverUrl;
    private Integer type;
    private Integer status;
    private Integer viewerCount;
    private Integer likeCount;
    private String streamUrl;
    private LocalDateTime startedAt;
}
