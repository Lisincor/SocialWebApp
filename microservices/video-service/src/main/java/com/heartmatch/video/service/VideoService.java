package com.heartmatch.video.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heartmatch.video.dto.VideoRequest;
import com.heartmatch.video.dto.VideoResponse;
import com.heartmatch.video.entity.Video;
import com.heartmatch.video.entity.VideoLike;
import com.heartmatch.video.repository.VideoLikeRepository;
import com.heartmatch.video.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VideoService {

    private final VideoRepository videoRepository;
    private final VideoLikeRepository videoLikeRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String VIDEO_VIEW_KEY = "video:view:";
    private static final String VIDEO_LIKE_KEY = "video:like:";

    /**
     * Upload video
     */
    @Transactional
    public VideoResponse uploadVideo(Long userId, VideoRequest request) {
        Video video = new Video();
        video.setUserId(userId);
        video.setTitle(request.getTitle());
        video.setDescription(request.getDescription());
        video.setVideoUrl(request.getVideoUrl());
        video.setCoverUrl(request.getCoverUrl());
        video.setDuration(request.getDuration());
        video.setMusicId(request.getMusicId());
        video.setTopicId(request.getTopicId());
        video.setLocation(request.getLocation());
        video.setStatus(0); // 审核中
        video.setLikeCount(0);
        video.setCommentCount(0);
        video.setShareCount(0);
        video.setViewCount(0);
        video.setCreatedAt(LocalDateTime.now());
        video.setUpdatedAt(LocalDateTime.now());

        videoRepository.insert(video);

        return convertToResponse(video, userId, false);
    }

    /**
     * Get recommended video feed
     */
    public Page<VideoResponse> getFeed(Long userId, int page, int size) {
        Page<Video> videoPage = new Page<>(page, size);
        LambdaQueryWrapper<Video> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Video::getStatus, 1) // 已发布
                   .orderByDesc(Video::getCreatedAt);

        Page<Video> result = videoRepository.selectPage(videoPage, queryWrapper);

        Page<VideoResponse> responsePage = new Page<>(page, size);
        List<VideoResponse> responses = result.getRecords().stream()
                .map(video -> convertToResponse(video, userId, isLiked(userId, video.getId())))
                .collect(Collectors.toList());

        responsePage.setRecords(responses);
        responsePage.setTotal(result.getTotal());
        responsePage.setPages(result.getPages());
        responsePage.setCurrent(result.getCurrent());
        responsePage.setSize(result.getSize());

        return responsePage;
    }

    /**
     * Get video detail
     */
    public VideoResponse getVideoDetail(Long videoId, Long userId) {
        Video video = videoRepository.selectById(videoId);
        if (video == null) {
            throw new RuntimeException("Video not found");
        }

        // Increment view count
        incrementViewCount(videoId);

        return convertToResponse(video, userId, isLiked(userId, videoId));
    }

    /**
     * Delete video
     */
    @Transactional
    public boolean deleteVideo(Long videoId, Long userId) {
        Video video = videoRepository.selectById(videoId);
        if (video == null) {
            return false;
        }
        if (!video.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this video");
        }

        return videoRepository.deleteById(videoId) > 0;
    }

    /**
     * Like video
     */
    @Transactional
    public boolean likeVideo(Long userId, Long videoId) {
        // Check if already liked
        LambdaQueryWrapper<VideoLike> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(VideoLike::getUserId, userId)
                   .eq(VideoLike::getVideoId, videoId);

        VideoLike existingLike = videoLikeRepository.selectOne(queryWrapper);
        if (existingLike != null) {
            return false; // Already liked
        }

        // Create like record
        VideoLike like = new VideoLike();
        like.setUserId(userId);
        like.setVideoId(videoId);
        like.setCreatedAt(LocalDateTime.now());
        videoLikeRepository.insert(like);

        // Update like count in cache
        String key = VIDEO_LIKE_KEY + videoId;
        redisTemplate.opsForValue().increment(key);

        return true;
    }

    /**
     * Unlike video
     */
    @Transactional
    public boolean unlikeVideo(Long userId, Long videoId) {
        LambdaQueryWrapper<VideoLike> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(VideoLike::getUserId, userId)
                   .eq(VideoLike::getVideoId, videoId);

        int deleted = videoLikeRepository.delete(queryWrapper);
        return deleted > 0;
    }

    /**
     * Record video view
     */
    public void recordView(Long videoId) {
        incrementViewCount(videoId);
    }

    /**
     * Duet with another video (create a response video)
     */
    @Transactional
    public VideoResponse duet(Long userId, Long sourceVideoId, VideoRequest request) {
        Video sourceVideo = videoRepository.selectById(sourceVideoId);
        if (sourceVideo == null) {
            throw new RuntimeException("Source video not found");
        }

        Video video = new Video();
        video.setUserId(userId);
        video.setTitle(request.getTitle() != null ? request.getTitle() : "Duet with " + sourceVideo.getTitle());
        video.setDescription(request.getDescription());
        video.setVideoUrl(request.getVideoUrl());
        video.setCoverUrl(request.getCoverUrl());
        video.setDuration(request.getDuration());
        video.setMusicId(sourceVideo.getMusicId()); // Use same music
        video.setTopicId(sourceVideo.getTopicId());
        video.setLocation(request.getLocation());
        video.setStatus(0);
        video.setLikeCount(0);
        video.setCommentCount(0);
        video.setShareCount(0);
        video.setViewCount(0);
        video.setCreatedAt(LocalDateTime.now());
        video.setUpdatedAt(LocalDateTime.now());

        videoRepository.insert(video);

        // Increment share count of source video
        sourceVideo.setShareCount(sourceVideo.getShareCount() + 1);
        videoRepository.updateById(sourceVideo);

        return convertToResponse(video, userId, false);
    }

    private void incrementViewCount(Long videoId) {
        String key = VIDEO_VIEW_KEY + videoId;
        redisTemplate.opsForValue().increment(key);

        // Sync to database periodically (in production, use scheduled task)
        Video video = videoRepository.selectById(videoId);
        if (video != null) {
            video.setViewCount(video.getViewCount() + 1);
            videoRepository.updateById(video);
        }
    }

    private boolean isLiked(Long userId, Long videoId) {
        if (userId == null) {
            return false;
        }
        LambdaQueryWrapper<VideoLike> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(VideoLike::getUserId, userId)
                   .eq(VideoLike::getVideoId, videoId);
        return videoLikeRepository.selectCount(queryWrapper) > 0;
    }

    private VideoResponse convertToResponse(Video video, Long userId, boolean isLiked) {
        VideoResponse response = new VideoResponse();
        response.setId(video.getId());
        response.setUserId(video.getUserId());
        response.setTitle(video.getTitle());
        response.setDescription(video.getDescription());
        response.setVideoUrl(video.getVideoUrl());
        response.setCoverUrl(video.getCoverUrl());
        response.setDuration(video.getDuration());
        response.setLikeCount(video.getLikeCount());
        response.setCommentCount(video.getCommentCount());
        response.setShareCount(video.getShareCount());
        response.setViewCount(video.getViewCount());
        response.setIsLiked(isLiked);
        response.setLocation(video.getLocation());
        response.setCreatedAt(video.getCreatedAt());

        // In production, fetch nickname and avatar from user service
        response.setNickname("User_" + video.getUserId());
        response.setAvatar("");

        return response;
    }
}