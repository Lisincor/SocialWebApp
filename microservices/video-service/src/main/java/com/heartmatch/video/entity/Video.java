package com.heartmatch.video.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("video")
public class Video {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private String title;

    private String description;

    private String videoUrl;

    private String coverUrl;

    private Integer duration;

    private Integer likeCount;

    private Integer commentCount;

    private Integer shareCount;

    private Integer viewCount;

    private Long musicId;

    private Long topicId;

    private String location;

    /**
     * 0-审核中, 1-已发布, 2-已下架, 3-审核失败
     */
    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableLogic
    private Integer deleted;
}
