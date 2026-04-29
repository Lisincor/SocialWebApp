package com.heartmatch.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heartmatch.entity.UserAuth;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserAuthRepository extends BaseMapper<UserAuth> {
}