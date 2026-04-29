import { create } from 'zustand';
import { getFeed, getPostById, likePost, unlikePost, favoritePost, unfavoritePost, getFavorites, createPost } from '../services/feed';

export const useFeedStore = create((set, get) => ({
  posts: [],
  favorites: [],
  page: 1,
  hasMore: true,
  isLoading: false,
  error: null,

  // Fetch post detail
  fetchPostDetail: async (postId) => {
    set({ isLoading: true, error: null });
    try {
      const post = await getPostById(postId);
      set({ isLoading: false });
      return post;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return null;
    }
  },

  // Publish post
  publishPost: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newPost = await createPost(data);
      set((state) => ({
        posts: [newPost, ...state.posts],
        isLoading: false,
      }));
      return newPost;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Fetch feed
  fetchFeed: async (feedType = 'recommend', refresh = false) => {
    const { page, posts, isLoading, hasMore } = get();

    if (isLoading || (!hasMore && !refresh)) return;

    set({ isLoading: true, error: null });

    try {
      const newPage = refresh ? 1 : page;
      const response = await getFeed(feedType, newPage);
      const { list, total, pageSize } = response;

      const newPosts = refresh ? list : [...posts, ...list];

      set({
        posts: newPosts,
        page: newPage + 1,
        hasMore: newPosts.length < total,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
    }
  },

  // Like post
  likePost: async (postId) => {
    try {
      await likePost(postId);
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: true,
                likeCount: post.likeCount + 1,
              }
            : post
        ),
      }));
      return true;
    } catch (error) {
      console.error('Like error:', error);
      return false;
    }
  },

  // Unlike post
  unlikePost: async (postId) => {
    try {
      await unlikePost(postId);
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: false,
                likeCount: Math.max(0, post.likeCount - 1),
              }
            : post
        ),
      }));
      return true;
    } catch (error) {
      console.error('Unlike error:', error);
      return false;
    }
  },

  // Favorite post
  favoritePost: async (postId) => {
    try {
      await favoritePost(postId);
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { ...post, isFavorited: true }
            : post
        ),
      }));
      return true;
    } catch (error) {
      console.error('Favorite error:', error);
      return false;
    }
  },

  // Unfavorite post
  unfavoritePost: async (postId) => {
    try {
      await unfavoritePost(postId);
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { ...post, isFavorited: false }
            : post
        ),
      }));
      return true;
    } catch (error) {
      console.error('Unfavorite error:', error);
      return false;
    }
  },

  // Fetch favorites
  fetchFavorites: async (refresh = false) => {
    set({ isLoading: true, error: null });

    try {
      const response = await getFavorites(1);
      set({ favorites: response.list, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.message });
    }
  },

  // Reset
  reset: () => {
    set({
      posts: [],
      favorites: [],
      page: 1,
      hasMore: true,
      isLoading: false,
      error: null,
    });
  },
}));
