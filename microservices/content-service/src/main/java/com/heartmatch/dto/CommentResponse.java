package com.heartmatch.dto;

import lombok.Data;
import java.util.List;

@Data
public class CommentResponse {
    private Long id;
    private Long postId;
    private Long userId;
    private String nickname;
    private String avatar;
    private String content;
    private Long parentId;
    private Integer likeCount;
    private Integer replyCount;
    private Boolean isLiked;
    private String createdAt;
    private List<CommentResponse> replies;
}