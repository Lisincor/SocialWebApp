import api from './api';
import { handleApiResponse } from './api';

// Get wallet balance
export const getWalletBalance = async () => {
  const response = await api.get('/api/v1/wallet/balance');
  return handleApiResponse(response);
};

// Recharge wallet
export const rechargeWallet = async (amount, payType = 1) => {
  const response = await api.post('/api/v1/wallet/recharge', {
    amount,
    payType, // 1: WeChat, 2: Alipay, 3: Apple IAP
  });
  return handleApiResponse(response);
};

// Get transaction records
export const getTransactionRecords = async (page = 1, size = 20) => {
  const response = await api.get('/api/v1/wallet/records', {
    params: { page, size },
  });
  return handleApiResponse(response);
};

// Get VIP products
export const getVipProducts = async () => {
  const response = await api.get('/api/v1/vip/products');
  return handleApiResponse(response);
};

// Subscribe VIP
export const subscribeVip = async (productType, payType = 1) => {
  const response = await api.post('/api/v1/vip/subscribe', {
    productType, // 1: monthly, 2: yearly
    payType,
  });
  return handleApiResponse(response);
};

// Get VIP status
export const getVipStatus = async () => {
  const response = await api.get('/api/v1/vip/status');
  return handleApiResponse(response);
};

// Get gifts list
export const getGifts = async () => {
  const response = await api.get('/api/v1/gifts');
  return handleApiResponse(response);
};
