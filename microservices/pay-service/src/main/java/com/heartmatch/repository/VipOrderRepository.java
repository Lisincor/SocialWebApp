package com.heartmatch.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heartmatch.entity.VipOrder;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface VipOrderRepository extends BaseMapper<VipOrder> {
}
