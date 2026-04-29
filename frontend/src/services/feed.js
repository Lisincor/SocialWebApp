import api from './api';
import { handleApiResponse } from './api';

// Get feed posts
export const getFeed = async (feedType = 'recommend', page = 1, pageSize = 20) => {
  const response = await api.get('/api/v1/posts/feed', {
    params: { feedType, page, pageSize },
  });
  return handleApiResponse(response);
};

// Get post by ID
export const getPostById = async (postId) => {
  const response = await api.get(`/api/v1/posts/${postId}`);
  return handleApiResponse(response);
};

// Create post
export const createPost = async (data) => {
  const response = await api.post('/api/v1/posts', data);
  return handleApiResponse(response);
};

// Delete post
export const deletePost = async (postId) => {
  const response = await api.delete(`/api/v1/posts/${postId}`);
  return handleApiResponse(response);
};

// Get user posts
export const getUserPosts = async (userId, page = 1, pageSize = 20) => {
  const response = await api.get(`/api/v1/posts/user/${userId}`, {
    params: { page, pageSize },
  });
  return handleApiResponse(response);
};

// Like post
export const likePost = async (postId) => {
  const response = await api.post(`/api/v1/posts/${postId}/like`);
  return handleApiResponse(response);
};

// Unlike post
export const unlikePost = async (postId) => {
  const response = await api.delete(`/api/v1/posts/${postId}/like`);
  return handleApiResponse(response);
};

// Favorite post
export const favoritePost = async (postId) => {
  const response = await api.post(`/api/v1/posts/${postId}/favorite`);
  return handleApiResponse(response);
};

// Unfavorite post
export const unfavoritePost = async (postId) => {
  const response = await api.delete(`/api/v1/posts/${postId}/favorite`);
  return handleApiResponse(response);
};

// Share post
export const sharePost = async (postId) => {
  const response = await api.post(`/api/v1/posts/${postId}/share`);
  return handleApiResponse(response);
};

// View post (track impression)
export const viewPost = async (postId) => {
  const response = await api.post(`/api/v1/posts/${postId}/view`);
  return handleApiResponse(response);
};

// Get favorites
export const getFavorites = async (page = 1, pageSize = 20) => {
  const response = await api.get('/api/v1/posts/favorites', {
    params: { page, pageSize },
  });
  return handleApiResponse(response);
};

// Get post comments
export const getComments = async (postId, page = 1, pageSize = 20) => {
  const response = await api.get(`/api/v1/posts/${postId}/comments`, {
    params: { page, pageSize },
  });
  return handleApiResponse(response);
};

// Add comment
export const addComment = async (postId, content, parentId = null) => {
  const response = await api.post(`/api/v1/posts/${postId}/comments`, {
    content,
    parentId,
  });
  return handleApiResponse(response);
};

// Delete comment
export const deleteComment = async (commentId) => {
  const response = await api.delete(`/api/v1/comments/${commentId}`);
  return handleApiResponse(response);
};

// Like comment
export const likeComment = async (commentId) => {
  const response = await api.post(`/api/v1/comments/${commentId}/like`);
  return handleApiResponse(response);
};

// Get topics
export const getTopics = async (page = 1, size = 20, category = null) => {
  const response = await api.get('/api/v1/topics', {
    params: { page, pageSize: size, category },
  });
  return handleApiResponse(response);
};

// Get trending topics
export const getTrendingTopics = async (limit = 10) => {
  const response = await api.get('/api/v1/topics/trending', {
    params: { limit },
  });
  return handleApiResponse(response);
};

// Get stories
export const getFollowingStories = async () => {
  const response = await api.get('/api/v1/stories/following');
  return handleApiResponse(response);
};

// Get story by ID
export const getStoryById = async (storyId) => {
  const response = await api.get(`/api/v1/stories/${storyId}`);
  return handleApiResponse(response);
};

// Create story
export const createStory = async (mediaUrl, thumbnailUrl, duration = 15) => {
  const response = await api.post('/api/v1/stories', {
    mediaUrl,
    thumbnailUrl,
    duration,
  });
  return handleApiResponse(response);
};

// View story
export const viewStory = async (storyId) => {
  const response = await api.post(`/api/v1/stories/${storyId}/view`);
  return handleApiResponse(response);
};

// Delete story
export const deleteStory = async (storyId) => {
  const response = await api.delete(`/api/v1/stories/${storyId}`);
  return handleApiResponse(response);
};
