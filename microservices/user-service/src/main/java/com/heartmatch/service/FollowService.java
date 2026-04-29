package com.heartmatch.service;

import com.heartmatch.entity.Follow;
import com.heartmatch.repository.FollowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;

    /**
     * 关注用户
     */
    public void follow(Long followerId, Long followingId) {
        if (followerId.equals(followingId)) {
            throw new RuntimeException("不能关注自己");
        }

        // 检查是否已关注
        Follow existing = followRepository.selectOne(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Follow>()
                .eq(Follow::getFollowerId, followerId)
                .eq(Follow::getFollowingId, followingId)
        );

        if (existing != null) {
            throw new RuntimeException("已经关注过了");
        }

        Follow follow = new Follow();
        follow.setFollowerId(followerId);
        follow.setFollowingId(followingId);
        follow.setType(1);
        followRepository.insert(follow);
    }

    /**
     * 取消关注
     */
    public void unfollow(Long followerId, Long followingId) {
        followRepository.delete(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Follow>()
                .eq(Follow::getFollowerId, followerId)
                .eq(Follow::getFollowingId, followingId)
        );
    }

    /**
     * 检查是否关注
     */
    public boolean isFollowing(Long followerId, Long followingId) {
        return followRepository.selectCount(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Follow>()
                .eq(Follow::getFollowerId, followerId)
                .eq(Follow::getFollowingId, followingId)
        ) > 0;
    }

    /**
     * 获取粉丝数
     */
    public Long getFollowerCount(Long userId) {
        return followRepository.selectCount(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Follow>()
                .eq(Follow::getFollowingId, userId)
        );
    }

    /**
     * 获取关注数
     */
    public Long getFollowingCount(Long userId) {
        return followRepository.selectCount(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Follow>()
                .eq(Follow::getFollowerId, userId)
        );
    }
}