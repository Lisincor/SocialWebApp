package com.heartmatch.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.heartmatch.dto.UserInfoResponse;
import com.heartmatch.dto.UpdateProfileRequest;
import com.heartmatch.entity.User;
import com.heartmatch.entity.UserProfile;
import com.heartmatch.entity.UserPhoto;
import com.heartmatch.repository.UserRepository;
import com.heartmatch.repository.UserProfileRepository;
import com.heartmatch.repository.UserPhotoRepository;
import com.heartmatch.repository.UserInterestRepository;
import com.heartmatch.entity.UserInterest;
import com.heartmatch.entity.InterestTag;
import com.heartmatch.repository.InterestTagRepository;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserPhotoRepository userPhotoRepository;
    private final UserInterestRepository userInterestRepository;
    private final InterestTagRepository interestTagRepository;

    /**
     * 获取当前用户信息
     */
    public UserInfoResponse getCurrentUser(Long userId) {
        User user = userRepository.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        UserInfoResponse response = new UserInfoResponse();
        response.setId(user.getId());
        response.setUid(user.getUid());
        response.setPhone(user.getPhone());
        response.setNickname(user.getNickname());
        response.setAvatar(user.getAvatar());
        response.setGender(user.getGender());
        response.setBirthday(user.getBirthday());
        response.setBio(user.getBio());
        response.setVipLevel(user.getVipLevel());
        response.setVipExpireAt(user.getVipExpireAt());
        response.setLastActiveAt(user.getLastActiveAt());

        // 查询profile
        UserProfile profile = userProfileRepository.selectOne(
            new LambdaQueryWrapper<UserProfile>().eq(UserProfile::getUserId, userId)
        );
        if (profile != null) {
            response.setHeight(profile.getHeight());
            response.setWeight(profile.getWeight());
            response.setJob(profile.getJob());
            response.setIncome(profile.getIncome());
            response.setEducation(profile.getEducation());
            response.setSchool(profile.getSchool());
            response.setCity(profile.getCity());
            response.setHometown(profile.getHometown());
            response.setLongitude(profile.getLongitude());
            response.setLatitude(profile.getLatitude());
        }

        // 查询照片
        List<UserPhoto> photos = userPhotoRepository.selectList(
            new LambdaQueryWrapper<UserPhoto>()
                .eq(UserPhoto::getUserId, userId)
                .orderByAsc(UserPhoto::getPosition)
        );
        response.setPhotos(photos.stream().map(UserPhoto::getUrl).collect(Collectors.toList()));

        return response;
    }

    /**
     * 根据UID获取用户信息
     */
    public UserInfoResponse getUserByUid(String uid) {
        User user = userRepository.selectOne(
            new LambdaQueryWrapper<User>().eq(User::getUid, uid)
        );
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        return getCurrentUser(user.getId());
    }

    /**
     * 更新用户资料
     */
    @Transactional
    public void updateProfile(Long userId, UpdateProfileRequest request) {
        // 更新User表
        User user = new User();
        user.setId(userId);
        if (request.getNickname() != null) {
            user.setNickname(request.getNickname());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getBirthday() != null) {
            user.setBirthday(java.time.LocalDate.parse(request.getBirthday()));
        }
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }
        userRepository.updateById(user);

        // 更新或插入Profile表
        UserProfile profile = userProfileRepository.selectOne(
            new LambdaQueryWrapper<UserProfile>().eq(UserProfile::getUserId, userId)
        );

        if (profile == null) {
            profile = new UserProfile();
            profile.setUserId(userId);
        }

        if (request.getHeight() != null) profile.setHeight(request.getHeight());
        if (request.getWeight() != null) profile.setWeight(request.getWeight());
        if (request.getJob() != null) profile.setJob(request.getJob());
        if (request.getIncome() != null) profile.setIncome(request.getIncome());
        if (request.getEducation() != null) profile.setEducation(request.getEducation());
        if (request.getSchool() != null) profile.setSchool(request.getSchool());
        if (request.getCity() != null) profile.setCity(request.getCity());
        if (request.getHometown() != null) profile.setHometown(request.getHometown());
        if (request.getLongitude() != null) profile.setLongitude(request.getLongitude());
        if (request.getLatitude() != null) profile.setLatitude(request.getLatitude());

        if (profile.getId() != null) {
            userProfileRepository.updateById(profile);
        } else {
            userProfileRepository.insert(profile);
        }
    }

    /**
     * 上传头像
     */
    public String uploadAvatar(Long userId, String url) {
        // 更新用户头像
        userRepository.update(
            null,
            new LambdaUpdateWrapper<User>()
                .eq(User::getId, userId)
                .set(User::getAvatar, url)
        );
        return url;
    }

    /**
     * 上传照片
     */
    @Transactional
    public String uploadPhoto(Long userId, String url, Integer position) {
        // 检查照片数量
        Long count = userPhotoRepository.selectCount(
            new LambdaQueryWrapper<UserPhoto>().eq(UserPhoto::getUserId, userId)
        );
        if (count >= 9) {
            throw new RuntimeException("最多上传9张照片");
        }

        // 如果是第一个，设置为主图
        if (count == 0) {
            userRepository.update(
                null,
                new LambdaUpdateWrapper<User>()
                    .eq(User::getId, userId)
                    .set(User::getAvatar, url)
            );
        }

        UserPhoto photo = new UserPhoto();
        photo.setUserId(userId);
        photo.setUrl(url);
        photo.setPosition(position != null ? position : count.intValue() + 1);
        photo.setIsAvatar(count == 0 ? 1 : 0);
        photo.setAuditStatus(1);
        userPhotoRepository.insert(photo);

        return url;
    }

    /**
     * 删除照片
     */
    @Transactional
    public void deletePhoto(Long userId, Long photoId) {
        UserPhoto photo = userPhotoRepository.selectOne(
            new LambdaQueryWrapper<UserPhoto>()
                .eq(UserPhoto::getId, photoId)
                .eq(UserPhoto::getUserId, userId)
        );
        if (photo == null) {
            throw new RuntimeException("照片不存在");
        }

        userPhotoRepository.deleteById(photoId);
    }

    /**
     * 获取用户照片列表
     */
    public List<String> getUserPhotos(Long userId) {
        List<UserPhoto> photos = userPhotoRepository.selectList(
            new LambdaQueryWrapper<UserPhoto>()
                .eq(UserPhoto::getUserId, userId)
                .orderByAsc(UserPhoto::getPosition)
        );
        return photos.stream().map(UserPhoto::getUrl).collect(Collectors.toList());
    }

    /**
     * 搜索用户
     */
    public List<UserInfoResponse> searchUsers(String keyword, Long currentUserId) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(User::getNickname, keyword)
            .or()
            .like(User::getPhone, keyword)
            .ne(User::getId, currentUserId)
            .eq(User::getStatus, 1)
            .last("LIMIT 50");

        List<User> users = userRepository.selectList(wrapper);
        return users.stream().map(this::convertToUserInfo).collect(Collectors.toList());
    }

    private UserInfoResponse convertToUserInfo(User user) {
        UserInfoResponse response = new UserInfoResponse();
        response.setId(user.getId());
        response.setUid(user.getUid());
        response.setNickname(user.getNickname());
        response.setAvatar(user.getAvatar());
        response.setGender(user.getGender());
        response.setVipLevel(user.getVipLevel());
        return response;
    }

    /**
     * 获取用户基本信息（供其他微服务调用）
     */
    public Map<String, String> getUserBasicInfo(Long userId) {
        Map<String, String> userInfo = new HashMap<>();

        User user = userRepository.selectById(userId);
        if (user != null) {
            userInfo.put("nickname", user.getNickname() != null ? user.getNickname() : "用户" + userId);
            userInfo.put("avatar", user.getAvatar() != null ? user.getAvatar() : "");
        } else {
            userInfo.put("nickname", "用户" + userId);
            userInfo.put("avatar", "");
        }

        return userInfo;
    }
}