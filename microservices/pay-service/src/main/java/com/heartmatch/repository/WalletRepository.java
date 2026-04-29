package com.heartmatch.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heartmatch.entity.Wallet;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface WalletRepository extends BaseMapper<Wallet> {
}
