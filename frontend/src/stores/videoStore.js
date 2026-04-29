import { create } from 'zustand';
import { getVideoFeed, likeVideo as apiLikeVideo } from '../services/video';

export const useVideoStore = create((set, get) => ({
  videos: [],
  currentIndex: 0,
  isLoading: false,
  hasMore: true,
  page: 1,
  error: null,

  // Fetch videos
  fetchVideos: async (refresh = false) => {
    const { isLoading, page, videos, hasMore } = get();

    if (isLoading && !refresh) return;
    if (!hasMore && !refresh) return;

    set({ isLoading: true, error: null });

    try {
      const newPage = refresh ? 1 : page;
      const data = await getVideoFeed(newPage);

      // Handle pagination response (MyBatis-Plus returns { records, total, pages, etc. })
      const videoList = Array.isArray(data) ? data : (data?.records || []);

      set({
        videos: refresh ? videoList : [...videos, ...videoList],
        page: newPage + 1,
        hasMore: videoList.length >= 10,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
    }
  },

  // Set current index
  setCurrentIndex: (index) => {
    set({ currentIndex: index });
  },

  // Like video
  likeVideo: async (videoId) => {
    try {
      await apiLikeVideo(videoId);

      // Update video in state
      set((state) => ({
        videos: state.videos.map((v) =>
          v.id === videoId
            ? { ...v, isLiked: !v.isLiked, likeCount: v.isLiked ? v.likeCount - 1 : v.likeCount + 1 }
            : v
        ),
      }));
    } catch (error) {
      console.error('Like video error:', error);
      throw error;
    }
  },

  // Bookmark video
  bookmarkVideo: async (videoId) => {
    set((state) => ({
      videos: state.videos.map((v) =>
        v.id === videoId
          ? { ...v, isBookmarked: !v.isBookmarked }
          : v
      ),
    }));
  },

  // Reset
  reset: () => {
    set({
      videos: [],
      currentIndex: 0,
      isLoading: false,
      hasMore: true,
      page: 1,
      error: null,
    });
  },
}));