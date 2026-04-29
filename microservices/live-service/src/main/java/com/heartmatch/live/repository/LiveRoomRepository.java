package com.heartmatch.live.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heartmatch.live.entity.LiveRoom;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LiveRoomRepository extends BaseMapper<LiveRoom> {
}
