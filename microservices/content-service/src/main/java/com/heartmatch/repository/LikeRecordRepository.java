package com.heartmatch.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heartmatch.entity.LikeRecord;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LikeRecordRepository extends BaseMapper<LikeRecord> {
}