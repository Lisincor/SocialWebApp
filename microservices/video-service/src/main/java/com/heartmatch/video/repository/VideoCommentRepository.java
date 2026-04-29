package com.heartmatch.video.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heartmatch.video.entity.VideoComment;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface VideoCommentRepository extends BaseMapper<VideoComment> {
}
