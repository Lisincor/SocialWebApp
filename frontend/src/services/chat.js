import api from './api';
import { handleApiResponse } from './api';

// Get conversations list
export const getConversations = async () => {
  const response = await api.get('/api/v1/conversations');
  return handleApiResponse(response);
};

// Get conversation by ID
export const getConversationById = async (conversationId) => {
  const response = await api.get(`/api/v1/conversations/${conversationId}`);
  return handleApiResponse(response);
};

// Create conversation
export const createConversation = async (type = 1, memberIds = [], name = '') => {
  const response = await api.post('/api/v1/conversations', {
    type,
    name,
    memberIds,
  });
  return handleApiResponse(response);
};

// Mark conversation as read
export const markAsRead = async (conversationId) => {
  const response = await api.put(`/api/v1/conversations/${conversationId}/read`);
  return handleApiResponse(response);
};

// Get messages in conversation
export const getMessages = async (conversationId, page = 1, size = 20) => {
  const response = await api.get(`/api/v1/conversations/${conversationId}/messages`, {
    params: { page, size },
  });
  return handleApiResponse(response);
};

// Send message
export const sendMessage = async (conversationId, type = 1, content, mediaUrl = null, duration = null, burnAfterRead = false) => {
  const response = await api.post('/api/v1/messages', {
    conversationId,
    type, // 1: text, 2: image, 3: audio, 4: video
    content,
    mediaUrl,
    duration,
    burnAfterRead,
  });
  return handleApiResponse(response);
};

// Mark message as read
export const markMessageAsRead = async (messageId) => {
  const response = await api.put(`/api/v1/messages/${messageId}/read`);
  return handleApiResponse(response);
};

// Recall message
export const recallMessage = async (messageId) => {
  const response = await api.delete(`/api/v1/messages/${messageId}`);
  return handleApiResponse(response);
};

// Burn message (阅后即焚)
export const burnMessage = async (messageId) => {
  const response = await api.post(`/api/v1/messages/${messageId}/burn`);
  return handleApiResponse(response);
};
