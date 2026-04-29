package com.heartmatch.video.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("video_comment")
public class VideoComment {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long videoId;

    private Long userId;

    /**
     * 父评论ID，0表示一级评论
     */
    private Long parentId;

    private String content;

    private Integer likeCount;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableLogic
    private Integer deleted;
}
