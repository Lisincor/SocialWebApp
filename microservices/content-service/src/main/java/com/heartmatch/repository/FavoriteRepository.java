package com.heartmatch.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heartmatch.entity.Favorite;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FavoriteRepository extends BaseMapper<Favorite> {
}