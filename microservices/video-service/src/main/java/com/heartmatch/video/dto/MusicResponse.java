package com.heartmatch.video.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MusicResponse {

    private Long id;

    private String title;

    private String artist;

    private String url;

    private Integer duration;

    private Integer useCount;
}
