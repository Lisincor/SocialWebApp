package com.heartmatch.dto;

import lombok.Data;
import java.util.List;

@Data
public class PostRequest {
    private String content;
    private Integer type = 1;  // 1图文 2视频 3故事
    private List<String> mediaUrls;
    private Long musicId;
    private String musicTitle;
    private String location;
    private Long topicId;
    private Integer duration;  // 故事时长
}