package com.heartmatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("post")
public class Post {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;
    private String content;
    private Integer type;  // 1图文 2视频 3故事
    private String mediaUrls;  // JSON数组
    private Long musicId;
    private String musicTitle;
    private String location;
    private Long topicId;
    private Integer likeCount;
    private Integer commentCount;
    private Integer shareCount;
    private Integer viewCount;
    private Integer status;  // 1正常 0删除
    private Integer auditStatus;
    private LocalDateTime expireAt;  // 故事过期时间

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}