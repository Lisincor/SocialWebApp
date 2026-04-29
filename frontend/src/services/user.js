import api from './api';
import { handleApiResponse } from './api';

// Get current user info
export const getCurrentUser = async () => {
  const response = await api.get('/api/v1/users/me');
  return handleApiResponse(response);
};

// Update user profile
export const updateProfile = async (data) => {
  const response = await api.put('/api/v1/users/me', data);
  return handleApiResponse(response);
};

// Get user by UID
export const getUserByUid = async (uid) => {
  const response = await api.get(`/api/v1/users/${uid}`);
  return handleApiResponse(response);
};

// Upload avatar - 接收图床 URL
export const uploadAvatar = async (url) => {
  const response = await api.put('/api/v1/users/me/avatar', { url });
  return handleApiResponse(response);
};

// Upload photos
export const uploadPhotos = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  const response = await api.put('/api/v1/users/me/photos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return handleApiResponse(response);
};

// Get user photos
export const getUserPhotos = async () => {
  const response = await api.get('/api/v1/users/me/photos');
  return handleApiResponse(response);
};

// Delete user photo
export const deletePhoto = async (photoId) => {
  const response = await api.delete(`/api/v1/users/me/photos/${photoId}`);
  return handleApiResponse(response);
};

// Search users
export const searchUsers = async (keyword, page = 1, size = 20) => {
  const response = await api.get('/api/v1/users/search', {
    params: { keyword, page, size },
  });
  return handleApiResponse(response);
};

// Get user followers
export const getUserFollowers = async (uid, page = 1, size = 20) => {
  const response = await api.get(`/api/v1/users/${uid}/followers`, {
    params: { page, size },
  });
  return handleApiResponse(response);
};

// Get user followings
export const getUserFollowings = async (uid, page = 1, size = 20) => {
  const response = await api.get(`/api/v1/users/${uid}/followings`, {
    params: { page, size },
  });
  return handleApiResponse(response);
};

// Follow user
export const followUser = async (uid) => {
  const response = await api.post(`/api/v1/follows/${uid}`);
  return handleApiResponse(response);
};

// Unfollow user
export const unfollowUser = async (uid) => {
  const response = await api.delete(`/api/v1/follows/${uid}`);
  return handleApiResponse(response);
};

// Get user posts
export const getUserPosts = async (uid, page = 1, pageSize = 20) => {
  const response = await api.get(`/api/v1/posts/user/${uid}`, {
    params: { page, pageSize },
  });
  return handleApiResponse(response);
};
