package com.heartmatch.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heartmatch.entity.Swipe;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SwipeRepository extends BaseMapper<Swipe> {
}
