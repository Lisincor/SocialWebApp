package com.heartmatch.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heartmatch.entity.MatchRecord;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MatchRecordRepository extends BaseMapper<MatchRecord> {
}
