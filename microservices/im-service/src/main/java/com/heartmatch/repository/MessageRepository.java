package com.heartmatch.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heartmatch.entity.Message;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MessageRepository extends BaseMapper<Message> {
}
