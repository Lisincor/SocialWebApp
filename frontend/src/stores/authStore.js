import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  sendCode,
  register,
  loginByAccount,
  loginBySms,
  logout as authLogout,
} from '../services/auth';
import { getCurrentUser } from '../services/user';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,

      // 发送验证码
      sendVerificationCode: async (phone, type = 1) => {
        set({ isLoading: true, error: null });
        try {
          await sendCode(phone, type);
          set({ isLoading: false });
          return true;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return false;
        }
      },

      // 注册（设置账户名和密码）
      register: async (phone, code, username, password, nickname, gender) => {
        set({ isLoading: true, error: null });
        try {
          const response = await register(phone, code, username, password, nickname, gender);
          const { accessToken, refreshToken, userInfo } = response;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('user', JSON.stringify(userInfo));

          set({
            user: userInfo,
            isLoggedIn: true,
            isLoading: false,
          });

          return true;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return false;
        }
      },

      // 账户密码登录
      loginByAccount: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginByAccount(username, password);
          const { accessToken, refreshToken, userInfo } = response;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('user', JSON.stringify(userInfo));

          set({
            user: userInfo,
            isLoggedIn: true,
            isLoading: false,
          });

          return true;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return false;
        }
      },

      // 手机号验证码登录
      loginBySms: async (phone, code) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginBySms(phone, code);
          const { accessToken, refreshToken, userInfo } = response;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('user', JSON.stringify(userInfo));

          set({
            user: userInfo,
            isLoggedIn: true,
            isLoading: false,
          });

          return true;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return false;
        }
      },

      // 登出
      logout: async () => {
        try {
          await authLogout();
        } catch (error) {
          console.error('Logout error:', error);
        }

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        set({
          user: null,
          isLoggedIn: false,
          error: null,
        });
      },

      // 获取当前用户
      fetchCurrentUser: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          set({ isLoggedIn: false });
          return;
        }

        try {
          const user = await getCurrentUser();
          set({ user, isLoggedIn: true });
        } catch (error) {
          console.error('Fetch user error:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          set({ user: null, isLoggedIn: false });
        }
      },

      // 更新用户信息
      updateUser: (userData) => {
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
      },

      // 清除错误
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
