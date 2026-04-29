package com.heartmatch.video.controller;

import com.heartmatch.video.dto.ApiResponse;
import com.heartmatch.video.dto.MusicResponse;
import com.heartmatch.video.service.MusicService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/musics")
@RequiredArgsConstructor
public class MusicController {

    private final MusicService musicService;

    /**
     * GET /api/v1/musics - 获取音乐列表
     */
    @GetMapping
    public ApiResponse<List<MusicResponse>> getMusicList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        List<MusicResponse> musicList = musicService.getMusicList(page, size);
        return ApiResponse.success(musicList);
    }

    /**
     * GET /api/v1/musics/search - 搜索音乐
     */
    @GetMapping("/search")
    public ApiResponse<List<MusicResponse>> searchMusic(
            @RequestParam String keyword) {

        List<MusicResponse> results = musicService.searchMusic(keyword);
        return ApiResponse.success(results);
    }

    /**
     * GET /api/v1/musics/hot - 获取热门音乐
     */
    @GetMapping("/hot")
    public ApiResponse<List<MusicResponse>> getHotMusic(
            @RequestParam(defaultValue = "10") int limit) {

        List<MusicResponse> hotMusic = musicService.getHotMusic(limit);
        return ApiResponse.success(hotMusic);
    }

    /**
     * GET /api/v1/musics/{id} - 获取音乐详情
     */
    @GetMapping("/{id}")
    public ApiResponse<MusicResponse> getMusicDetail(@PathVariable Long id) {
        MusicResponse music = musicService.getMusicById(id);
        return ApiResponse.success(music);
    }
}