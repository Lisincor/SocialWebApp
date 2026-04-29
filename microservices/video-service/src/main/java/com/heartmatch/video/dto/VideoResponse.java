package com.heartmatch.video.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoResponse {

    private Long id;

    private Long userId;

    private String nickname;

    private String avatar;

    private String title;

    private String description;

    private String videoUrl;

    private String coverUrl;

    private Integer duration;

    private Integer likeCount;

    private Integer commentCount;

    private Integer shareCount;

    private Integer viewCount;

    private Boolean isLiked;

    private String musicTitle;

    private String location;

    private LocalDateTime createdAt;
}
