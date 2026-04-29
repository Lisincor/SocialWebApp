package com.heartmatch.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heartmatch.entity.Gift;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface GiftRepository extends BaseMapper<Gift> {
}
