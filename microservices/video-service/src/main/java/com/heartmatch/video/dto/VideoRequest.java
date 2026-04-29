package com.heartmatch.video.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoRequest {

    private String title;

    private String description;

    private String videoUrl;

    private String coverUrl;

    private Integer duration;

    private Long musicId;

    private Long topicId;

    private String location;
}
