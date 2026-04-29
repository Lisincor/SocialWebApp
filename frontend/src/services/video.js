import api from './api';
import { handleApiResponse } from './api';

// Get video feed (reels)
export const getVideoFeed = async (page = 1, size = 10) => {
  const response = await api.get('/api/v1/reels/feed', {
    params: { page, size },
  });
  return handleApiResponse(response);
};

// Get video by ID
export const getVideoById = async (videoId) => {
  const response = await api.get(`/api/v1/reels/${videoId}`);
  return handleApiResponse(response);
};

// Upload video
export const uploadVideo = async (data) => {
  const response = await api.post('/api/v1/reels', data);
  return handleApiResponse(response);
};

// Delete video
export const deleteVideo = async (videoId) => {
  const response = await api.delete(`/api/v1/reels/${videoId}`);
  return handleApiResponse(response);
};

// Like video
export const likeVideo = async (videoId) => {
  const response = await api.post(`/api/v1/reels/${videoId}/like`);
  return handleApiResponse(response);
};

// Record video view
export const recordVideoView = async (videoId) => {
  const response = await api.post(`/api/v1/reels/${videoId}/view`);
  return handleApiResponse(response);
};

// Get music list
export const getMusics = async (page = 1, size = 20, category = null) => {
  const response = await api.get('/api/v1/musics', {
    params: { page, size, category },
  });
  return handleApiResponse(response);
};

// Search music
export const searchMusic = async (keyword, page = 1, size = 20) => {
  const response = await api.get('/api/v1/musics/search', {
    params: { keyword, page, size },
  });
  return handleApiResponse(response);
};

// Get hot music
export const getHotMusic = async () => {
  const response = await api.get('/api/v1/musics/hot');
  return handleApiResponse(response);
};

// Get live rooms
export const getLiveRooms = async (page = 1, size = 20) => {
  const response = await api.get('/api/v1/lives', {
    params: { page, size },
  });
  return handleApiResponse(response);
};

// Get live room by ID
export const getLiveRoomById = async (roomId) => {
  const response = await api.get(`/api/v1/lives/${roomId}`);
  return handleApiResponse(response);
};

// Join live room
export const joinLiveRoom = async (roomId) => {
  const response = await api.post(`/api/v1/lives/${roomId}/join`);
  return handleApiResponse(response);
};

// Leave live room
export const leaveLiveRoom = async (roomId) => {
  const response = await api.post(`/api/v1/lives/${roomId}/leave`);
  return handleApiResponse(response);
};

// Send live comment (barrage)
export const sendLiveComment = async (roomId, content) => {
  const response = await api.post(`/api/v1/lives/${roomId}/comment`, { content });
  return handleApiResponse(response);
};

// Send gift in live
export const sendGift = async (roomId, giftId) => {
  const response = await api.post(`/api/v1/lives/${roomId}/gift`, { giftId });
  return handleApiResponse(response);
};

// Get gifts list
export const getGifts = async () => {
  const response = await api.get('/api/v1/gifts');
  return handleApiResponse(response);
};
