package com.heartmatch.video.service;

import com.heartmatch.video.dto.MusicResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class MusicService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String MUSIC_LIST_KEY = "music:list:";

    /**
     * Get music list (with pagination)
     */
    public List<MusicResponse> getMusicList(int page, int size) {
        // In production, this would query from database
        // For now, return mock data
        List<MusicResponse> musicList = new ArrayList<>();

        int start = page * size;
        for (int i = start; i < start + size && i < 100; i++) {
            MusicResponse music = new MusicResponse();
            music.setId((long) (i + 1));
            music.setTitle("Trending Music " + (i + 1));
            music.setArtist("Artist " + (i + 1));
            music.setUrl("https://music.example.com/" + (i + 1) + ".mp3");
            music.setDuration(30 + new Random().nextInt(120));
            music.setUseCount(1000 + new Random().nextInt(9000));
            musicList.add(music);
        }

        return musicList;
    }

    /**
     * Search music by keyword
     */
    public List<MusicResponse> searchMusic(String keyword) {
        List<MusicResponse> results = new ArrayList<>();

        // Mock search results
        for (int i = 1; i <= 5; i++) {
            MusicResponse music = new MusicResponse();
            music.setId((long) i);
            music.setTitle(keyword + " Song " + i);
            music.setArtist("Artist " + i);
            music.setUrl("https://music.example.com/search/" + i + ".mp3");
            music.setDuration(45 + new Random().nextInt(60));
            music.setUseCount(500 + new Random().nextInt(5000));
            results.add(music);
        }

        return results;
    }

    /**
     * Get hot music (trending)
     */
    public List<MusicResponse> getHotMusic(int limit) {
        return getMusicList(0, limit);
    }

    /**
     * Get music detail by ID
     */
    public MusicResponse getMusicById(Long musicId) {
        MusicResponse music = new MusicResponse();
        music.setId(musicId);
        music.setTitle("Music " + musicId);
        music.setArtist("Artist");
        music.setUrl("https://music.example.com/" + musicId + ".mp3");
        music.setDuration(60);
        music.setUseCount(2000);
        return music;
    }
}