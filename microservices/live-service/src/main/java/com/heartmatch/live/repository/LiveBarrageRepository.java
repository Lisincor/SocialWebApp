package com.heartmatch.live.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heartmatch.live.entity.LiveBarrage;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LiveBarrageRepository extends BaseMapper<LiveBarrage> {
}
