import axios from 'axios';

// imgBB 图床 API 配置
// 注册获取 API Key: https://api.imgbb.com
// 使用环境变量存储 API Key，生产环境请替换为实际值
const IMG_BB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || 'YOUR_IMGBB_API_KEY';
const IMG_BB_API_URL = 'https://api.imgbb.com/1/upload';

// 上传图片到 imgBB
export const uploadImageToSmMs = async (file) => {
  const formData = new FormData();
  formData.append('key', IMG_BB_API_KEY);
  formData.append('image', file);

  try {
    const response = await axios.post(IMG_BB_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
    });

    const data = response.data;

    if (data.success) {
      return {
        url: data.data.url,
        filename: data.data.title,
        size: data.data.size,
        width: data.data.width,
        height: data.data.height,
      };
    } else {
      throw new Error(data.error?.message || '上传失败');
    }
  } catch (error) {
    console.error('Upload error:', error);
    if (error.response?.data?.error?.message) {
      throw new Error(error.response.data.error.message);
    }
    throw error;
  }
};
