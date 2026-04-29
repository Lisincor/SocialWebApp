import api from './api';
import { handleApiResponse } from './api';

// ==================== 发送验证码 ====================

export const sendCode = async (phone, type = 1) => {
  const response = await api.post('/api/v1/auth/send-code', { phone, type });
  return handleApiResponse(response);
};

// ==================== 注册 ====================

// 验证注册验证码
export const verifyRegisterCode = async (phone, code) => {
  const response = await api.post('/api/v1/auth/verify-register-code', { phone, code });
  return handleApiResponse(response);
};

// 注册（设置账户名和密码）
export const register = async (phone, code, username, password, nickname, gender) => {
  const response = await api.post('/api/v1/auth/register', {
    phone,
    code,
    username,
    password,
    nickname,
    gender,
  });
  return handleApiResponse(response);
};

// ==================== 登录 ====================

// 账户密码登录
export const loginByAccount = async (username, password) => {
  const response = await api.post('/api/v1/auth/login-account', { username, password });
  return handleApiResponse(response);
};

// 手机号验证码登录
export const loginBySms = async (phone, code) => {
  const response = await api.post('/api/v1/auth/login-sms', { phone, code });
  return handleApiResponse(response);
};

// ==================== Token管理 ====================

export const refreshToken = async () => {
  const response = await api.post('/api/v1/auth/refresh-token');
  return handleApiResponse(response);
};

export const logout = async () => {
  const response = await api.post('/api/v1/auth/logout');
  return handleApiResponse(response);
};

// ==================== 密码管理 ====================

export const changePassword = async (oldPassword, newPassword) => {
  const response = await api.post('/api/v1/auth/change-password', {
    oldPassword,
    newPassword,
  });
  return handleApiResponse(response);
};
