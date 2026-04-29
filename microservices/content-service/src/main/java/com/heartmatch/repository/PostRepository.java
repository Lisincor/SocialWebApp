package com.heartmatch.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heartmatch.entity.Post;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PostRepository extends BaseMapper<Post> {
}