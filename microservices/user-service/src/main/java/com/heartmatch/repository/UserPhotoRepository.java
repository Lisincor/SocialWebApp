package com.heartmatch.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heartmatch.entity.UserPhoto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserPhotoRepository extends BaseMapper<UserPhoto> {
}