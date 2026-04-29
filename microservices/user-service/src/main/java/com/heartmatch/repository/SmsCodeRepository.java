package com.heartmatch.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heartmatch.entity.SmsCode;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SmsCodeRepository extends BaseMapper<SmsCode> {
}