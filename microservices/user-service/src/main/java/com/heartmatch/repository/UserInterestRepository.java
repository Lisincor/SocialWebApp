package com.heartmatch.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heartmatch.entity.UserInterest;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserInterestRepository extends BaseMapper<UserInterest> {
}