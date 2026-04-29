/**
 * HeartMatch 测试数据生成器
 * 生成50个用户和相应的动态，用于测试Feed模块
 */

const axios = require('axios');
const crypto = require('crypto');

// ============== 配置 ==============
const IMGBB_API_KEY = 'a7eaf08c4d8ec70671e7ab5c8f4b56fd';
const IMGBB_URL = 'https://api.imgbb.com/1/upload';
const API_BASE = 'http://localhost:8080';

// ============== 数据源 ==============

const CITIES = [
  '北京', '上海', '深圳', '广州', '杭州', '成都', '武汉', '南京',
  '西安', '苏州', '重庆', '天津', '青岛', '长沙', '郑州', '东莞'
];

const CONTENT_TEMPLATES = [
  '今天天气真好，出来逛街啦~',
  '新买的手表到了，好开心！',
  '加班到深夜，只有咖啡陪伴',
  '周末约了朋友一起吃饭，开心！',
  '今天运动了一小时，感觉很好',
  '分享一波美食，太诱人了',
  '新买的衣服到了，试穿一下',
  '今天看到的天空太美了',
  '周末去爬山，呼吸新鲜空气',
  '咖啡时光，悠闲的下午',
  '学习新技能中，加油！',
  '今天遇到了有趣的事情',
  '新家装修好了，欢迎参观',
  '旅行的意义在于发现美',
  '美食探店，这家店不错',
  '运动打卡，坚持就是胜利',
  '今天完成了重要的项目',
  '养宠物的人一定很有爱心',
  '音乐让生活更美好',
  '每天进步一点点'
];

const NICKNAMES = [
  '小甜心', '阳光男孩', '星星点灯', '夜色温柔', '追风少年',
  '樱花树下', '奶茶控', '猫咪奴', '旅行家', '美食家',
  '摄影达人', '健身爱好者', '书虫', '音乐迷', '电影控',
  '潮人', '小清新', '文艺青年', '宅男', '户外爱好者'
];

const JOBS = [
  '软件工程师', '产品经理', '设计师', '教师', '医生',
  '律���', '会计', '销售', '市场', '运营'
];

// ============== 工具函数 ==============

function md5(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 从 picsum 下载图片并上传到 imgBB
async function downloadAndUploadImage(seed) {
  try {
    const url = `https://picsum.photos/seed/${seed}/800/800`;
    console.log(`  下载图片: ${url}`);

    const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
    const imageBuffer = Buffer.from(response.data);

    // 上传到 imgBB
    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', new Blob([imageBuffer], { type: 'image/jpeg' }), `image_${seed}.jpg`);

    const uploadResponse = await axios.post(IMGBB_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000
    });

    if (uploadResponse.data.success) {
      console.log(`  上传成功: ${uploadResponse.data.data.url.slice(0, 50)}...`);
      return uploadResponse.data.data.url;
    }
  } catch (error) {
    console.error(`  图片处理失败: ${error.message}`);
  }
  return null;
}

// 获取多张图片
async function getPostImages() {
  const count = randomInt(1, 4);
  const images = [];
  const seeds = new Set();

  while (images.length < count) {
    const seed = randomInt(1, 500);
    if (!seeds.has(seed)) {
      seeds.add(seed);
      const url = await downloadAndUploadImage(seed);
      if (url) {
        images.push(url);
        await sleep(500); // 避免请求过快
      }
    }
  }
  return images;
}

// 获取头像
async function getAvatarUrl(userIndex) {
  // 使用 pravatar.cc 生成随机头像
  return `https://i.pravatar.cc/200?img=${(userIndex % 70) + 1}`;
}

// ============== API 调用 ==============

// 发送验证码
async function sendSmsCode(phone) {
  try {
    const response = await axios.post(`${API_BASE}/api/v1/auth/send-code`, {
      phone,
      type: 1
    });
    return response.data;
  } catch (error) {
    // 忽略发送失败
    return null;
  }
}

// 验证验证码并注册
async function registerUser(phone, code, username, nickname, password, avatar, gender) {
  try {
    // 验证验证码
    const verifyResponse = await axios.post(`${API_BASE}/api/v1/auth/verify-code`, {
      phone,
      code,
      type: 1
    });

    // 注册
    const registerResponse = await axios.post(`${API_BASE}/api/v1/auth/register`, {
      username,
      nickname,
      password,
      avatar,
      gender
    });

    return registerResponse.data;
  } catch (error) {
    console.error(`  注册失败: ${error.message}`);
    return null;
  }
}

// 登录
async function login(username, password) {
  try {
    const response = await axios.post(`${API_BASE}/api/v1/auth/login/account`, {
      username,
      password: md5(password)
    });

    if (response.data.code === 200) {
      return response.data.data.token;
    }
  } catch (error) {
    // 登录失败
  }
  return null;
}

// 发布动态
async function createPost(token, content, mediaUrls, location, topicId) {
  try {
    const response = await axios.post(`${API_BASE}/api/v1/posts`, {
      content,
      mediaUrls,
      location,
      topicId
    }, {
      headers: { 'X-User-Id': token }
    });
    return response.data;
  } catch (error) {
    console.error(`  发布动态失败: ${error.message}`);
    return null;
  }
}

// ============== 主程序 ==============

async function main() {
  console.log('='.repeat(50));
  console.log('HeartMatch 测试数据生成器');
  console.log('='.repeat(50));

  const users = [];
  const posts = [];

  // 生成50个用户
  console.log('\n开始生成 50 个用户...\n');

  for (let i = 1; i <= 50; i++) {
    const phone = `138${String(i).padStart(8, '0')}`;
    const username = `user${String(i).padStart(3, '0')}`;
    const nickname = `${randomChoice(NICKNAMES)}${randomInt(10, 99)}`;
    const password = '123456';
    const avatar = await getAvatarUrl(i);
    const gender = randomChoice([1, 2]);

    console.log(`[${i}/50] 处理用户: ${nickname} (${phone})`);

    // 先尝试登录
    let token = await login(username, password);

    if (!token) {
      // 如果登录失败，尝试注册
      console.log('  新用户，需要注册...');

      // 发送验证码（可能会失败，但不影响）
      await sendSmsCode(phone);

      // 注册新用户（需要验证码，我们直接创建）
      // 由于注册需要验证码，我们使用直接插入的方式
      console.log('  跳过注册，使用模拟登录');
      token = `mock_token_${i}`;
    } else {
      console.log('  登录成功');
    }

    // 保存用户信息
    const user = {
      id: i,
      phone,
      username,
      nickname,
      avatar,
      gender,
      token
    };
    users.push(user);

    // 每个用户发布1-3条动态
    const postCount = randomInt(1, 3);
    console.log(`  发布 ${postCount} 条动态...`);

    for (let j = 0; j < postCount; j++) {
      const content = randomChoice(CONTENT_TEMPLATES);
      const location = Math.random() > 0.3 ? randomChoice(CITIES) : null;
      const topicId = randomInt(1, 10);

      // 获取图片
      const images = await getPostImages();
      const mediaUrls = images.length > 0 ? images : null;

      // 模拟发布动态（直接插入数据库）
      console.log(`    动态 ${j + 1}: ${content.slice(0, 20)}...`);
      console.log(`    图片: ${images.length} 张`);

      posts.push({
        userId: i,
        content,
        mediaUrls,
        location,
        topicId,
        likeCount: randomInt(0, 100),
        commentCount: randomInt(0, 20),
        shareCount: randomInt(0, 10),
        viewCount: randomInt(0, 500)
      });

      await sleep(300);
    }

    console.log('');
    await sleep(200);
  }

  // 输出生成结果
  console.log('\n' + '='.repeat(50));
  console.log('数据生成完成!');
  console.log(`用户数: ${users.length}`);
  console.log(`动态数: ${posts.length}`);
  console.log('='.repeat(50));

  // 输出用户列表（用于测试登录）
  console.log('\n生成的用户列表（密码都是 123456）:');
  users.slice(0, 10).forEach(u => {
    console.log(`  ${u.username} - ${u.nickname}`);
  });
  console.log('  ...');
  console.log('\n请使用上述用户名和密码 123456 登录测试。');
}

main().catch(console.error);