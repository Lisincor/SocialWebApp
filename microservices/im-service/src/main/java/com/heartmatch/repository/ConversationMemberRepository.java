package com.heartmatch.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heartmatch.entity.ConversationMember;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ConversationMemberRepository extends BaseMapper<ConversationMember> {
}
