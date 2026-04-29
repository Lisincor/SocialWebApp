import api from './api';
import { handleApiResponse } from './api';

// Get recommended users for matching
export const getMatchRecommendations = async (page = 1, size = 10) => {
  const response = await api.get('/api/v1/matches/recommend', {
    params: { page, size },
  });
  return handleApiResponse(response);
};

// Handle swipe action
export const swipe = async (targetUserId, action) => {
  const response = await api.post('/api/v1/matches/swipe', {
    targetUserId,
    action, // 1: like, 2: skip, 3: super like
  });
  return handleApiResponse(response);
};

// Get matches list
export const getMatches = async () => {
  const response = await api.get('/api/v1/matches');
  return handleApiResponse(response);
};

// Today's luck - random match
export const todayLuck = async () => {
  const response = await api.post('/api/v1/matches/today-luck');
  return handleApiResponse(response);
};

// Get remaining likes
export const getRemainingLikes = async () => {
  const response = await api.get('/api/v1/matches/likes/remaining');
  return handleApiResponse(response);
};
