package com.heartmatch.dto;

import lombok.Data;
import java.util.List;

@Data
public class PostResponse {
    private Long id;
    private Long userId;
    private String nickname;
    private String avatar;
    private String content;
    private Integer type;
    private List<String> mediaUrls;
    private String musicTitle;
    private String location;
    private Long topicId;
    private String topicName;
    private Integer likeCount;
    private Integer commentCount;
    private Integer shareCount;
    private Integer viewCount;
    private Boolean isLiked;
    private Boolean isFavorited;
    private String createdAt;
}