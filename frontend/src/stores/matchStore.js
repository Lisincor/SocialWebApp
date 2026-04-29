import { create } from 'zustand';
import { getMatchRecommendations, swipe, getMatches, getRemainingLikes } from '../services/match';

export const useMatchStore = create((set, get) => ({
  users: [],
  matches: [],
  currentIndex: 0,
  remainingLikes: 0,
  isLoading: false,
  hasMore: true,
  page: 1,
  error: null,
  matchResult: null,

  // Fetch users (recommendations)
  fetchUsers: async (refresh = false) => {
    const { isLoading, page, users, hasMore } = get();

    if (isLoading && !refresh) return;

    set({ isLoading: true, error: null });

    try {
      const newPage = refresh ? 1 : page;
      const data = await getMatchRecommendations(newPage, 10);

      set({
        users: refresh ? data : [...users, ...data],
        page: newPage + 1,
        hasMore: data.length >= 10,
        isLoading: false,
        currentIndex: refresh ? 0 : get().currentIndex,
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
    }
  },

  // Swipe user
  swipeUser: async (targetUserId, action) => {
    // action: 'like' = 1, 'pass' = 2, 'superlike' = 3
    const actionMap = { like: 1, pass: 2, superlike: 3 };
    const actionValue = actionMap[action];

    set({ isLoading: true, error: null });

    try {
      const response = await swipe(targetUserId, actionValue);
      const isMatch = response?.isMatch || response?.matched;

      // Remove swiped user from recommendations
      set((state) => ({
        users: state.users.filter((u) => u.id !== targetUserId),
        currentIndex: Math.max(0, state.currentIndex),
        isLoading: false,
      }));

      // Update remaining likes if action is like or super like
      if (action === 'like' || action === 'superlike') {
        set((state) => ({
          remainingLikes: Math.max(0, state.remainingLikes - 1),
        }));
      }

      // Set match result if matched
      if (isMatch && response?.matchedUser) {
        set({ matchResult: response.matchedUser });
      }

      return { isMatch, matchedUser: response?.matchedUser };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return null;
    }
  },

  // Fetch remaining likes
  fetchRemainingLikes: async () => {
    try {
      const remaining = await getRemainingLikes();
      set({ remainingLikes: remaining });
    } catch (error) {
      console.error('Fetch remaining likes error:', error);
    }
  },

  // Fetch matches
  fetchMatches: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await getMatches();
      set({ matches: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.message });
    }
  },

  // Clear match result
  clearMatch: () => {
    set({ matchResult: null });
  },

  // Reset
  reset: () => {
    set({
      users: [],
      matches: [],
      currentIndex: 0,
      remainingLikes: 0,
      isLoading: false,
      hasMore: true,
      page: 1,
      error: null,
      matchResult: null,
    });
  },
}));