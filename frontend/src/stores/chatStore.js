import { create } from 'zustand';
import { getConversations, getMessages, sendMessage, markAsRead } from '../services/chat';

export const useChatStore = create((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,

  // Fetch conversations
  fetchConversations: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await getConversations();
      set({ conversations: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.message });
    }
  },

  // Set current conversation
  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation });
  },

  // Fetch messages
  fetchMessages: async (conversationId) => {
    set({ isLoading: true, error: null });

    try {
      const data = await getMessages(conversationId);
      set({ messages: data, isLoading: false });
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return [];
    }
  },

  // Send message
  sendMessage: async (conversationId, type, content, mediaUrl, duration, burnAfterRead) => {
    try {
      const message = await sendMessage(conversationId, type, content, mediaUrl, duration, burnAfterRead);

      // Add message to list
      set((state) => ({
        messages: [...state.messages, message],
      }));

      // Update conversation last message
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? { ...conv, lastMessage: message, lastMessageAt: new Date() }
            : conv
        ),
      }));

      return message;
    } catch (error) {
      console.error('Send message error:', error);
      return null;
    }
  },

  // Mark conversation as read
  markAsRead: async (conversationId) => {
    try {
      await markAsRead(conversationId);

      // Update conversation unread count
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        ),
      }));
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  },

  // Update conversation when receiving new message (WebSocket)
  addMessage: (message) => {
    const { currentConversation } = get();

    set((state) => ({
      messages: [...state.messages, message],
      conversations: state.conversations.map((conv) =>
        conv.id === message.conversationId
          ? { ...conv, lastMessage: message, lastMessageAt: new Date() }
          : conv
      ),
    }));
  },

  // Clear messages
  clearMessages: () => {
    set({ messages: [], currentConversation: null });
  },

  // Reset
  reset: () => {
    set({
      conversations: [],
      currentConversation: null,
      messages: [],
      isLoading: false,
      error: null,
    });
  },
}));
