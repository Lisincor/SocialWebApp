package com.heartmatch.video.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heartmatch.video.entity.VideoLike;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface VideoLikeRepository extends BaseMapper<VideoLike> {
}
