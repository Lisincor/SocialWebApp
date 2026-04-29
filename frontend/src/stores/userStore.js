import { create } from 'zustand';
import { getUserByUid, getUserPosts, updateProfile as apiUpdateProfile, followUser as apiFollowUser, unfollowUser as apiUnfollowUser, uploadAvatar as apiUploadAvatar, searchUsers as apiSearchUsers } from '../services/user';
import { uploadImageToSmMs } from '../services/imageUpload';

export const useUserStore = create((set, get) => ({
  profile: null,
  posts: [],
  users: [],
  isLoading: false,
  isFollowing: false,
  error: null,

  // Fetch user profile
  fetchUserProfile: async (uid) => {
    set({ isLoading: true, error: null });

    try {
      // uid can be either numeric id or string uid
      const data = await getUserByUid(uid);
      set({
        profile: data,
        isFollowing: data?.isFollowing || false,
        isLoading: false,
      });
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return null;
    }
  },

  // Fetch user posts
  fetchUserPosts: async (uid, page = 1, pageSize = 20) => {
    try {
      // uid can be either numeric id or string uid
      const data = await getUserPosts(uid, page, pageSize);
      set((state) => ({
        posts: page === 1 ? data : [...state.posts, ...data],
      }));
      return data;
    } catch (error) {
      console.error('Fetch user posts error:', error);
      return [];
    }
  },

  // Update profile
  updateProfile: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const updatedProfile = await apiUpdateProfile(data);
      set({ profile: updatedProfile, isLoading: false });
      return updatedProfile;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return null;
    }
  },

  // Upload avatar - 使用 sm.ms 图床
  uploadAvatar: async (file) => {
    set({ isLoading: true, error: null });

    try {
      // 1. 上传到 sm.ms 图床
      const uploadResult = await uploadImageToSmMs(file);
      const avatarUrl = uploadResult.url;

      // 2. 更新后端用户头像
      await apiUploadAvatar(avatarUrl);
      set({ isLoading: false });
      return avatarUrl;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Follow user
  followUser: async (uid) => {
    try {
      await apiFollowUser(uid);

      set((state) => ({
        isFollowing: true,
        profile: state.profile
          ? {
              ...state.profile,
              followersCount: (state.profile.followersCount || 0) + 1,
            }
          : null,
      }));
      return true;
    } catch (error) {
      console.error('Follow error:', error);
      return false;
    }
  },

  // Unfollow user
  unfollowUser: async (uid) => {
    try {
      await apiUnfollowUser(uid);

      set((state) => ({
        isFollowing: false,
        profile: state.profile
          ? {
              ...state.profile,
              followersCount: Math.max(0, (state.profile.followersCount || 0) - 1),
            }
          : null,
      }));
      return true;
    } catch (error) {
      console.error('Unfollow error:', error);
      return false;
    }
  },

  // Search users
  searchUsers: async (keyword) => {
    set({ isLoading: true, error: null });
    try {
      const users = await apiSearchUsers(keyword);
      set({ users, isLoading: false });
      return users;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return [];
    }
  },

  // Clear profile
  clearProfile: () => {
    set({ profile: null, posts: [], isFollowing: false, error: null });
  },

  // Reset
  reset: () => {
    set({
      profile: null,
      posts: [],
      isLoading: false,
      isFollowing: false,
      error: null,
    });
  },
}));