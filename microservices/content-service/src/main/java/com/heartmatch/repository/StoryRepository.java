package com.heartmatch.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heartmatch.entity.Story;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StoryRepository extends BaseMapper<Story> {
}