# 心动社交 (HeartMatch) 产品需求文档 v2.0

## 1. 项目概述

### 1.1 项目背景

在快节奏的现代生活中，年轻人渴望真实、有趣的社交体验。传统约会软件功能单一，缺乏内容消费和社交互动。本产品融合约会、社交Feed、短视频、社区等元素，打造新一代年轻人社交平台。

### 1.2 产品定位

**「心动社交」** - 不仅仅是约会，更是发现有趣灵魂的社交乐园

- **Instagram** 的内容美学与社交互动
- **TikTok** 的短视频沉浸体验
- **X (Twitter)** 的实时话题讨论
- **传统约会软件** 的精准匹配机制

### 1.3 核心价值主张

| 维度 | 价值点 |
|------|--------|
| 真实 | 真人认证体系，杜绝虚假 |
| 有趣 | 短视频+图文动态，展示真实自我 |
| 高效 | AI智能匹配，快速找到心动对象 |
| 互动 | 多维度社交，建立深度连接 |

---

## 2. 用户画像

### 2.1 目标用户

| 群体 | 年龄 | 特征 | 核心诉求 |
|------|------|------|----------|
| Z世代 | 18-24岁 | 追求个性表达，喜欢短视频 | 发现有趣内容，结识新朋友 |
| 年轻职场人 | 22-28岁 | 工作繁忙，社交圈有限 | 高效脱单，拓展社交圈 |
| 都市白领 | 25-35岁 | 有一定经济基础 | 品质社交，寻找志同道合的人 |
| 银发群体 | 45-60岁 | 退休或半退休状态 | 丰富生活，找到聊伴 |

### 2.2 用户旅程

```
注册 → 完善资料 → 真人认证 → 首次匹配
   ↓                              ↓
   ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
          持续使用飞轮
   ↓                              ↓
浏览内容/发布动态 ← → 互动社交 → 私信聊天
   ↓                              ↓
成为创作者 ← ← ← ← ← ← ← 沉淀关系链
```

---

## 3. 功能架构总览

```
┌─────────────────────────────────────────────────────────────┐
│                      心动社交 v2.0                           │
├─────────────┬─────────────┬─────────────┬─────────────────┤
│   首页Feed   │   匹配发现   │   消息通知   │     我的主页    │
├─────────────┼─────────────┼─────────────┼─────────────────┤
│ · 推荐内容   │ · 卡片滑动   │ · 私信聊天   │ · 个人资料      │
│ · 关注更新   │ · 附近的人   │ · 系统通知   │ · 动态列表      │
│ · 话题广场   │ · 智能推荐   │ · 互动通知   │ · 收藏夹        │
│ · 直播入口   │ · 超级喜欢   │ · 匹配通知   │ · 关注/粉丝     │
│ · 故事动态   │ · 今日缘分   │ · 礼物通知   │ · 钱包/会员     │
├─────────────┼─────────────┼─────────────┼─────────────────┤
│                        短视频模块                            │
├─────────────┴─────────────┴─────────────┴─────────────────┤
│ · 上下滑动沉浸浏览  · 拍摄上传  · 合拍/回复  · 特效滤镜       │
│ · BGM音乐库  · 话题标签  · 位置定位  · 直播功能              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. 首页Feed模块

### 4.1 内容类型

| 类型 | 描述 | 互动方式 |
|------|------|----------|
| 图文动态 | 1-9张图片 + 文字 | 点赞、评论、分享、收藏 |
| 短视频 | 最长3分钟视频 | 点赞、评论、分享、合拍 |
| 故事动态 | 24小时阅后即焚 | 回复、取消观看 |
| 直播 | 实时互动直播 | 评论、点赞、打赏 |

### 4.2 Feed算法

**推荐权重计算公式：**

```
Score = (互动分 × 0.4) + (关系分 × 0.3) + (新鲜分 × 0.2) + (热度分 × 0.1)

互动分 = (点赞数×1 + 评论数×3 + 分享数×5) / 基准值
关系分 = 关注状态(1) + 互动过(0.5) + 同一城市(0.3)
新鲜分 = e^(-天差/7)  // 7天内线性衰减
热度分 = (当前小时点赞 + 当前小时评论) / 基准值
```

### 4.3 Feed交互

```
┌────────────────────────────────────────┐
│  🔍搜索    发布动态    🔔通知    💬私信  │  <- 顶部导航
├────────────────────────────────────────┤
│  [关注]  [推荐]  [附近]  [直播]         │  <- Tab切换
├────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │
│  │ 👤 用户头像    @username  · 2h   │  │
│  │                                  │  │
│  │      📷 图片/🎬 视频预览         │  │
│  │                                  │  │
│  │ 正文内容...（超过3行折叠）        │  │
│  │ #话题标签  @提及用户             │  │
│  │                                  │  │
│  │ ❤️2.3万  💬892  🔗分享  🔖收藏   │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ← 左右滑动切换内容类型 →              │
│  ↓ 上下滑动切换下一条                  │
└────────────────────────────────────────┘
```

### 4.4 故事功能 (Stories)

- **发布**：最长15秒短视频或图片，添加滤镜、文字、贴纸
- **展示**：顶部横向滚动，用户头像外发光表示有新故事
- **互动**：可回复私信，回复内容仅对方可见
- **统计**：观看人数、观看名单
- **时效**：24小时后自动消失

### 4.5 话题广场

| 分类 | 示例 |
|------|------|
| 兴趣话题 | #摄影 #美食 #旅行 #健身 |
| 情感话题 | #今日份心动 #异地恋日常 #脱单日记 |
| 活动话题 | #周末组队 #线上相亲 #话题挑战 |
| 热门榜单 | #本周最热 #同城热议 #新人报道 |

---

## 5. 短视频模块 (HeartReels)

### 5.1 核心功能

**参考 TikTok 的沉浸式体验：**

```
┌────────────────────────────────────────┐
│  ← 返回           音乐🎵    更多 ⋮      │
├────────────────────────────────────────┤
│                                        │
│                                        │
│         🎬 视频播放区域                 │
│         (全屏沉浸式)                    │
│                                        │
│                                        │
├────────────────────────────────────────┤
│  👤头像(+1)  ❤️点赞数                   │
│  💬评论       ↗分享                     │
│  🔖收藏       🎵音乐                    │
├────────────────────────────────────────┤
│  🎵│███│ 背景音乐名 - 歌手名            │
├────────────────────────────────────────┤
│  @username                             │
│  视频描述文案...                        │
│  #话题 #话题 #话题                      │
│  📍北京市·朝阳区                       │
└────────────────────────────────────────┘
```

### 5.2 拍摄工具

| 功能 | 说明 |
|------|------|
| 分段拍摄 | 最多10段，每段最长60秒 |
| 定时拍摄 | 3秒/10秒倒计时 |
| 速度调节 | 0.3x / 0.5x / 1x / 2x / 3x |
| 滤镜 | 30+ 美颜滤镜 |
| 特效 | AR贴纸、3D表情、背景虚化 |
| 美颜 | 瘦脸、大眼、美白、磨皮 |
| 剪辑 | 剪裁、分割、调色 |

### 5.3 音乐库

- **来源**：热门音乐片段（15-60秒）
- **分类**：热歌榜、飙升榜、新歌榜、情感、电音、说唱
- **功能**：
  - 听歌识曲（识别并使用）
  - 原声使用次数显示
  - 创作者收益分成

### 5.4 合拍与回复

| 功能 | 描述 |
|------|------|
| 合拍 (Duet) | 左右分屏，与原视频同步播放 |
| 回复视频 | 原视频评论区的视频回复 |
| 拼接 | 多段视频合并 |

### 5.5 推荐算法

**完播率权重最高：**

```
推荐分 = 完播率×40% + 互动率×30% + 关注转化率×20% + 分享率×10%

完播率 = 观看时长 / 视频总时长
互动率 = (点赞+评论+收藏) / 观看人数
关注转化率 = 新增关注 / 观看人数
分享率 = 分享次数 / 观看人数
```

---

## 6. 匹配发现模块

### 6.1 滑动匹配 (原核心功能增强)

```
┌────────────────────────────────────────┐
│  今日缘分 [99+]     筛选 🔍             │
├────────────────────────────────────────┤
│                                        │
│  ┌────────────────────────────────┐   │
│  │                                │   │
│  │      📷 用户照片 (最多6张)      │   │
│  │      左右滑动切换               │   │
│  │                                │   │
│  │  ┌──────────────────────────┐  │   │
│  │  │ @username · 24岁 · 📍2km │  │   │
│  │  │ 🔥 综合匹配度 92%        │  │   │
│  │  │ 职业 | 学历 | 身高        │  │   │
│  │  │ "交友宣言文案..."         │  │   │
│  │  │ #摄影 #旅行 #美食         │  │   │
│  │  └──────────────────────────┘  │   │
│  │                                │   │
│  │  ← 跳过      ↑超级喜欢      →喜欢│   │
│  │           ↓举报                │   │
│  └────────────────────────────────┘   │
│                                        │
│  💡 超级喜欢会让对方100%看到你          │
│     今日剩余: 3次                       │
└────────────────────────────────────────┘
```

### 6.2 匹配规则

| 操作 | 效果 | 消耗 |
|------|------|------|
| 右滑喜欢 | 对方也喜欢你则匹配 | 1次喜欢次数 |
| 左滑跳过 | 不显示该用户 | 免费 |
| 上滑超级喜欢 | 优先展示给对方 | 1次超级喜欢 |
| 超级曝光 | 置顶展示给更多人 | VIP专属 |

### 6.3 智能推荐算法

```python
# 推荐评分公式
def calculate_match_score(user_a, user_b):
    # 基础匹配度 (35%)
    base_score = (
        age_similarity * 0.1 +
        height_preference * 0.1 +
        education_match * 0.1 +
        distance_score * 0.05
    )
    
    # 兴趣匹配度 (30%)
    interest_score = len(set(user_a.interests) & set(user_b.interests)) / \
                     max(len(set(user_a.interests) | set(user_b.interests)), 1)
    
    # 活跃度权重 (20%)
    activity_score = user_b.last_active_weight  # 越活跃越高
    
    # 认证加成 (15%)
    auth_score = user_b.auth_level * 0.03  # 最高0.15
    
    return base_score + interest_score * 0.3 + activity_score * 0.2 + auth_score
```

### 6.4 今日缘分

- **随机配对**：每日3次随机配对机会
- **灵魂测试**：完成性格问卷，获得性格标签匹配
- **缘分圈**：进入随机匹配聊天室（最多8人）

---

## 7. 即时通讯模块

### 7.1 消息类型

| 类型 | 说明 | 特性 |
|------|------|------|
| 文字 | 普通文本消息 | 支持@提及 |
| 图片 | 单图/多图 | 9图网格预览 |
| 语音 | 语音消息 | 最长60秒，可暂停 |
| 视频 | 短视频消息 | 最长30秒 |
| 表情包 | 动图/静态图 | 支持收藏 |
| 红包 | 虚拟礼物 | 带祝福语 |
| 卡片 | 分享内容卡片 | 用户/动态/短视频 |
| 位置 | 地理位置分享 | 显示地图 |
| 阅后即焚 | 5秒后自动销毁 | 仅图片/语音 |

### 7.2 聊天界面

```
┌────────────────────────────────────────┐
│  ← 返回  @username    更多 ⋮  语音通话 📞 │
├────────────────────────────────────────┤
│                                        │
│  ┌────────────────┐                    │
│  │ 对方消息气泡    │                    │
│  │ 📷 图片        │                    │
│  │ 10:30 ✓✓      │                    │
│  └────────────────┘                    │
│                                        │
│              2024年1月15日              │
│                                        │
│                    ┌────────────────┐   │
│                    │ 我的消息气泡    │   │
│                    │ 好的呀 😊      │   │
│                    │ 10:31 ✓✓      │   │
│                    └────────────────┘   │
│                                        │
│  👤在线 · 最后活跃 10分钟前              │
├────────────────────────────────────────┤
│  🤖  │  📷 │  📷 │  🎤 │  ✉️ │  ➕ │ ➡️│ │
│  AI  │ 图片│相机 │语音 │阅后│ 更多│发送 │
└────────────────────────────────────────┘
```

### 7.3 聊天功能

| 功能 | 说明 |
|------|------|
| 已读/未读 | 蓝色双勾表示已读 |
| 消息撤回 | 2分钟内可撤回 |
| 消息回复 | 引用回复某条消息 |
| AI助手 | 智能回复建议 |
| 消息免打扰 | 静音但保留消息 |
| 置顶聊天 | 聊天置顶显示 |
| 聊天背景 | 自定义背景图 |
| 消息提醒 | 设置特定消息提示音 |

### 7.4 聊天安全

- **反骚扰机制**：频繁骚扰自动警告，3次警告封禁
- **敏感词过滤**：实时检测并拦截
- **截图提醒**：对方截图时通知你
- **举报入口**：快速举报不当消息

---

## 8. 个人主页模块

### 8.1 主页结构

```
┌────────────────────────────────────────┐
│  ⚙️设置                    编辑资料 ✏️   │
├────────────────────────────────────────┤
│                                        │
│         👤 (圆形头像)                   │
│         头像右上角 🔵认证标识            │
│                                        │
│         @username                       │
│         个人签名/宣言文字               │
│                                        │
│    粉丝 1.2万  │  关注 328  │  获赞 5.6万│
│                                        │
│  [关注] [私信] [更多 ▾]                │
├────────────────────────────────────────┤
│  🔵 已认证：真实头像                     │
│  📍 北京市朝阳区                        │
│  📅 1998年8月 · 天秤座                  │
│  💼 产品经理 · 年薪20-30万              │
│  🎓 清华大学 · 硕士                      │
├────────────────────────────────────────┤
│  [动态(24)] [短视频(12)] [收藏(8)]     │
├────────────────────────────────────────┤
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐         │
│  │ 📷 │ │ 📷 │ │ 📷 │ │ 📷 │         │
│  └────┘ └────┘ └────┘ └────┘         │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐         │
│  │ 📷 │ │ 📷 │ │ 📷 │ │ 📷 │         │
│  └────┘ └────┘ └────┘ └────┘         │
└────────────────────────────────────────┘
```

### 8.2 访客记录

- **访客列表**：查看谁看过我的主页
- **访客统计**：浏览量、访客地域分布
- **隐身访问**：开启后不留下访客记录
- **特别关注**：标记后访问不通知对方

### 8.3 资料卡

| 分类 | 内容 |
|------|------|
| 基础信息 | 昵称、性别、生日、年龄、星座 |
| 外貌特征 | 身高、体重 |
| 工作教育 | 职业、职位、收入、学历、学校 |
| 生活习惯 | 吸烟、饮酒、运动频率 |
| 情感态度 | 婚姻状态、是否有孩子、理想中的关系 |
| 兴趣爱好 | 音乐、美食、旅行、运动等标签 |
| 家乡背景 | 家乡、现居城市 |
| 自我介绍 | 签名、交友宣言 |

---

## 9. 直播模块

### 9.1 直播类型

| 类型 | 描述 | 参与方式 |
|------|------|----------|
| 个人直播 | 用户开直播，粉丝观看互动 | 主播申请开通 |
| 红娘直播 | 专业红娘主持，引导交友 | 官方邀请 |
| 相亲直播 | 1v1视频相亲，连麦互动 | 付费进入 |
| 语音聊天室 | 多人语音讨论，类似Clubhouse | 自由进入 |

### 9.2 直播功能

```
┌────────────────────────────────────────┐
│  ← 退出    🎤 2.3万观看  🔴直播中       │
├────────────────────────────────────────┤
│                                        │
│         📺 直播间                       │
│         (横屏/竖屏切换)                 │
│                                        │
│  ┌───────────────────────────────┐    │
│  │ 弹幕飘过...                    │    │
│  │ 用户A：好漂亮！                 │    │
│  │ 用户B：求关注                  │    │
│  └───────────────────────────────┘    │
│                                        │
├────────────────────────────────────────┤
│  👤头像1  👤头像2  👤头像3  ...        │  <- 在线用户
├────────────────────────────────────────┤
│  ❤️1.2万  🎁礼物榜  📢连麦申请          │
├────────────────────────────────────────┤
│  粉丝A：主播好美        粉丝B：求连线   │
│  粉丝C：哈哈哈          粉丝D：关注了   │
├────────────────────────────────────────┤
│  🤖 │ 请输入评论...        │  🎁 │ ➕│ │
└────────────────────────────────────────┘
```

### 9.3 直播互动

| 功能 | 说明 |
|------|------|
| 弹幕 | 直播间内实时评论 |
| 点赞 | 直播间的点赞特效 |
| 礼物 | 虚拟礼物打赏，主播分成 |
| 连麦 | 观众申请连麦，主播同意 |
| PK | 两个主播连线互动比拼 |
| 禁言 | 主播禁言违规用户 |
| 踢出 | 主播踢出违规用户 |

### 9.4 直播收益

- **礼物分成**：平台与主播55:45分成
- **会员订阅**：粉丝订阅，月度收益
- **带货分成**：直播带货佣金

---

## 10. 社区广场模块

### 10.1 话题功能

**类似 X (Twitter) 的话题讨论：**

```
┌────────────────────────────────────────┐
│  🔍 搜索话题/用户                       │
├────────────────────────────────────────┤
│  🔥 热门话题                            │
│  ────────────────────────────          │
│  #周末去哪玩       12.3万讨论            │
│  #今日份ootd       8.7万讨论            │
│  #单身日记          6.5万讨论            │
│  #健身打卡          5.2万讨论            │
│  #美食分享          4.8万讨论            │
├────────────────────────────────────────┤
│  📍 同城热议                            │
│  ────────────────────────────           │
│  #北京脱单         1.2万讨论             │
│  #上海交友          9千讨论              │
│  #广州单身          7千讨论              │
├────────────────────────────────────────┤
│  🎯 兴趣圈子                            │
│  ────────────────────────────           │
│  📷摄影圈  🎮游戏圈  📚读书圈           │
│  🎵音乐圈  🍜美食圈  ✈️旅行圈           │
└────────────────────────────────────────┘
```

### 10.2 话题详情

| 功能 | 说明 |
|------|------|
| 话题简介 | 话题描述、参与规则 |
| 参与方式 | 发布时添加话题标签 |
| 热度榜单 | 按参与量排序 |
| 精华内容 | 编辑精选的优质内容 |
| 实时更新 | 新内容实时推送 |

### 10.3 群组功能

- **创建群组**：基于兴趣/地域/活动
- **加入群组**：公开群/邀请制
- **群内互动**：发布内容、群聊
- **群管理员**：审核成员、管理内容

---

## 11. 用户关系系统

### 11.1 关系类型

```
关注 ──────────────────┐
  │                      │
  ├─ 普通关注            │
  ├─ 特别关注 (不通知)   │
  └─ 双向关注 = 好友    │
                         │
粉丝 ───────────────────┤
                         │
黑名单 ──────────────────┤
                         │
悄悄关注 ────────────────┘
```

### 11.2 互动关系

| 关系 | 建立方式 | 效果 |
|------|----------|------|
| 点赞 | 给动态点赞 | 对方收到通知 |
| 收藏 | 收藏动态 | 收藏列表可见 |
| 送礼 | 赠送礼物 | 显示在主页礼物墙 |
| 合拍 | 制作合拍视频 | 双方视频关联 |

### 11.3 好友体系

- **成为好友**：双向关注自动成为好友
- **好友特权**：
  - 查看在线状态
  - 查看最后活跃时间
  - 免费语音/视频通话
  - 好友专属聊天背景

---

## 12. 会员与付费体系

### 12.1 会员等级

```
┌─────────────────────────────────────────────────────┐
│                   心动社交会员                        │
├─────────────────────────────────────────────────────┤
│  🌟 普通用户    💎 VIP会员    👑 年度会员            │
│  ──────────────────────────────────────────────────  │
│  免费基础功能   ¥25/月        ¥198/年               │
│                                                      │
│  基础功能:                                       ✓   │
│  • 每日10次喜欢次数                           ✓   │
│  • 基础筛选条件                               ✓   │
│  • 查看访客记录 (最近3人)                     ✓   │
│                                                      │
│  VIP特权:                                        💎   │
│  • 无限喜欢次数                                ★   │
│  • 查看谁喜欢了我                              ★   │
│  • 超级曝光 (置顶推荐)                        ★   │
│  • 高级筛选条件                                ★   │
│  • 查看全部访客记录                            ★   │
│  • 每日超级喜欢 x5                             ★   │
│  • 消息已读回执                                ★   │
│  • 在线标识                                    ★   │
│  • 专属VIP徽章                                  ★   │
│  • 专属会员滤镜                                 ★   │
│                                                      │
│  年度特权:                                      👑   │
│  • VIP全部特权                                 ★   │
│  • 线下活动优先权                              ★   │
│  • 专属客服通道                                ★   │
│  • 年费充值赠送3个月                            ★   │
└─────────────────────────────────────────────────────┘
```

### 12.2 虚拟货币

| 货币 | 用途 | 获取方式 |
|------|------|----------|
| 心动币 | 购买礼物、付费功能 | 充值、任务奖励 |
| 积分 | 日常任务奖励 | 签到、发帖、分享 |

### 12.3 礼物系统

| 礼物类型 | 价格 | 特效 |
|----------|------|------|
| 玫瑰 | 10币 | 普通 |
| 巧克力 | 50币 | 普通 |
| 香水 | 200币 | 中等 |
| 跑车 | 1000币 | 豪华 |
| 城堡 | 5000币 | 全屏特效 |

---

## 13. 认证体系

### 13.1 认证类型

| 认证 | 等级 | 证明材料 | 展示 |
|------|------|----------|------|
| 头像认证 | 基础 | 自拍视频验证 | 🔵蓝V |
| 身份认证 | 中级 | 身份证+人脸 | 🔵蓝V |
| 学历认证 | 高级 | 学信网验证 | 🎓学历V |
| 资产认证 | 高级 | 房产证/行驶证 | 💰资产V |
| 职业认证 | 中级 | 在职证明/工牌 | 💼职业V |
| 手机认证 | 基础 | 短信验证 | ✅已认证 |

### 13.2 认证流程

```
提交申请 → 材料审核 → 人工复核 → 认证通过
              ↓
          审核拒绝 → 修改重提
```

---

## 14. 安全与审核

### 14.1 内容审核

| 环节 | 技术 | 说明 |
|------|------|------|
| 发布前 | AI预审 | 图片+文字实时检测 |
| 发布后 | 人工抽审 | 重点内容二次审核 |
| 举报 | 优先审核 | 24小时内处理 |
| 敏感词 | 实时过滤 | 多级敏感词库 |

### 14.2 用户安全

| 功能 | 说明 |
|------|------|
| 隐私设置 | 位置隐藏、距离隐藏 |
| 黑名单 | 屏蔽用户所有内容 |
| 举报 | 举报不当内容/用户 |
| 反骚扰 | 自动识别并警告 |
| 敏感内容 | 马赛克处理 |

### 14.3 风险控制

- **异常行为检测**：频繁操作、批量注册识别
- **欺诈识别**：虚假信息、诈骗行为识别
- **未成年人保护**：年龄限制、人脸验证

---

## 15. 通知系统

### 15.1 通知类型

| 类型 | 触发条件 | 推送方式 |
|------|----------|----------|
| 匹配通知 | 互相喜欢 | 推送+站内信 |
| 消息通知 | 收到私信 | 推送+角标 |
| 互动通知 | 点赞/评论/收藏 | 合并推送 |
| 关注通知 | 新增粉丝 | 合并推送 |
| 直播通知 | 关注的人开播 | 推送 |
| 系统通知 | 活动/公告 | 推送 |

### 15.2 通知聚合

```
┌────────────────────────────────────────┐
│  🔔 通知中心                          │
├────────────────────────────────────────┤
│  📅 今天                               │
│  ────────────────────────────────────  │
│  ❤️ 5人喜欢了你的动态                   │
│     @用户A、@用户B 等5人 · 2小时前     │
│                                        │
│  👤 3人关注了你                        │
│     @用户C、@用户D 等3人 · 5小时前     │
│                                        │
│  💬 12条新评论                         │
│     查看全部评论 · 昨天                 │
│                                        │
│  🔴 @用户E 在直播                      │
│     进入直播间 · 昨天                   │
└────────────────────────────────────────┘
```

---

## 16. 数据统计与分析

### 16.1 用户数据

| 指标 | 说明 |
|------|------|
| DAU | 日活跃用户数 |
| MAU | 月活跃用户数 |
| 留存率 | 次日/7日/30日留存 |
| 使用时长 | 人均使用时长 |
| 打开频次 | 每日打开次数 |

### 16.2 内容数据

| 指标 | 说明 |
|------|------|
| 发布量 | 每日发布动态数 |
| 互动率 | 点赞/评论/分享率 |
| 完播率 | 视频完播率 |
| 分享率 | 分享到站外比例 |

### 16.3 商业数据

| 指标 | 说明 |
|------|------|
| 付费率 | 付费用户占比 |
| ARPU | 每用户平均收入 |
| LTV | 用户生命周期价值 |
| 转化率 | 免费→付费转化 |

---

## 17. 技术架构

### 17.1 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户端                                │
│     iOS / Android / Web / 小程序                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                             │
│              (Kong / Spring Cloud Gateway)                   │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────┬─────────┬─────────┬─────────┬─────────┐
        ▼         ▼         ▼         ▼         ▼         ▼
┌───────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  用户服务  │ │ Feed服务│ │ 匹配服务│ │ 消息服务│ │ 直播服务│ │ 支付服务│
│ UserService│ │FeedSvc │ │MatchSvc│ │ IMService│ │LiveSvc │ │PaySvc  │
└─────┬─────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
      │           │           │           │           │           │
      ▼           ▼           ▼           ▼           ▼           ▼
┌───────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│   MySQL   │ │ MySQL  │ │ MySQL  │ │ MySQL  │ │   KV   │ │MySQL   │
│  (用户库) │ │ (内容库)│ │ (匹配库)│ │ (消息库)│ │Redis   │
│           │ │ +ES    │ │ +ES    │ │ +ES    │ │        │ │        │
└───────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
```

### 17.2 前端技术栈

| 类型 | 技术 | 说明 |
|------|------|------|
| 框架 | React 18 / React Native | 跨平台开发 |
| 状态管理 | Zustand / Redux Toolkit | 状态管理 |
| 路由 | React Router v6 | SPA路由 |
| UI库 | Ant Design Mobile | 移动端组件 |
| 视频 | FFmpeg / 第三方SDK | 视频处理 |
| 地图 | 高德/腾讯SDK | 位置服务 |
| 即时通讯 | WebSocket + 信令 | 实时通信 |
| 推送 | 个推/JPush | 消息推送 |
| 统计 | GrowingIO / 神策 | 数据埋点 |

### 17.3 后端技术栈

| 类型 | 技术 | 说明 |
|------|------|------|
| 框架 | Spring Boot 3.x | 核心框架 |
| ORM | MyBatis-Plus | 数据访问 |
| 数据库 | MySQL 8.0 | 主数据库 |
| 缓存 | Redis 7.x | 缓存/会话 |
| 搜索 | Elasticsearch 8.x | 搜索/筛选 |
| 队列 | RocketMQ | 异步消息 |
| 文件存储 | MinIO / OSS | 文件存储 |
| 搜索 | 推荐算法 | ML平台 |
| 安全 | Spring Security + JWT | 认证授权 |
| 任务调度 | XXL-Job | 定时任务 |
| 日志 | ELK Stack | 日志系统 |
| 监控 | Prometheus + Grafana | 监控告警 |
| 容器 | Docker + K8s | 容器编排 |

### 17.4 基础设施

| 类型 | 技术 | 说明 |
|------|------|------|
| 服务器 | ECS / K8s | 计算资源 |
| CDN | 阿里云/腾讯云 | 静态资源 |
| SSL | Let's Encrypt | HTTPS证书 |
| DNS | DNSPod | 域名解析 |
| 负载均衡 | SLB / Nginx | 负载均衡 |
| 灾备 | 异地多活 | 容灾备份 |

---

## 18. 数据库设计 (核心表)

### 18.1 用户模块

```sql
-- 用户基础表
CREATE TABLE `user` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `uid` VARCHAR(32) UNIQUE NOT NULL COMMENT '用户UID',
    `phone` VARCHAR(20) UNIQUE COMMENT '手机号',
    `nickname` VARCHAR(50) COMMENT '昵称',
    `avatar` VARCHAR(500) COMMENT '头像URL',
    `gender` TINYINT DEFAULT 0 COMMENT '性别 0未知 1男 2女',
    `birthday` DATE COMMENT '生日',
    `bio` VARCHAR(200) COMMENT '个人签名',
    `status` TINYINT DEFAULT 1 COMMENT '状态 1正常 2禁用',
    `vip_level` TINYINT DEFAULT 0 COMMENT 'VIP等级 0普通 1月度 2年度',
    `vip_expire_at` DATETIME COMMENT 'VIP过期时间',
    `last_active_at` DATETIME COMMENT '最后活跃时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME COMMENT '删除时间'
);

-- 用户资料表
CREATE TABLE `user_profile` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `height` INT COMMENT '身高cm',
    `weight` INT COMMENT '体重kg',
    `job` VARCHAR(100) COMMENT '职业',
    `income` VARCHAR(50) COMMENT '收入区间',
    `education` VARCHAR(20) COMMENT '学历',
    `school` VARCHAR(100) COMMENT '学校',
    `city` VARCHAR(50) COMMENT '城市',
    `longitude` DECIMAL(10,7) COMMENT '经度',
    `latitude` DECIMAL(10,7) COMMENT '纬度',
    `marriage` TINYINT DEFAULT 0 COMMENT '婚姻状态',
    `smoking` TINYINT DEFAULT 0 COMMENT '吸烟',
    `drinking` TINYINT DEFAULT 0 COMMENT '饮酒',
    `hometown` VARCHAR(50) COMMENT '家乡',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- 用户认证表
CREATE TABLE `user_auth` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `real_name_auth` TINYINT DEFAULT 0 COMMENT '实名认证',
    `education_auth` TINYINT DEFAULT 0 COMMENT '学历认证',
    `job_auth` TINYINT DEFAULT 0 COMMENT '职业认证',
    `asset_auth` TINYINT DEFAULT 0 COMMENT '资产认证',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);
```

### 18.2 内容模块

```sql
-- 动态表
CREATE TABLE `post` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '发布者ID',
    `content` TEXT COMMENT '正文内容',
    `type` TINYINT DEFAULT 1 COMMENT '类型 1图文 2视频 3故事',
    `media_urls` JSON COMMENT '媒体URLs',
    `music_id` BIGINT COMMENT '背景音乐ID',
    `music_title` VARCHAR(100) COMMENT '音乐标题',
    `location` VARCHAR(100) COMMENT '位置',
    `like_count` INT DEFAULT 0 COMMENT '点赞数',
    `comment_count` INT DEFAULT 0 COMMENT '评论数',
    `share_count` INT DEFAULT 0 COMMENT '分享数',
    `view_count` INT DEFAULT 0 COMMENT '浏览数',
    `status` TINYINT DEFAULT 1 COMMENT '状态 1正常 0删除',
    `audit_status` TINYINT DEFAULT 0 COMMENT '审核状态',
    `expire_at` DATETIME COMMENT '过期时间(故事)',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- 评论表
CREATE TABLE `comment` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `post_id` BIGINT NOT NULL COMMENT '动态ID',
    `user_id` BIGINT NOT NULL COMMENT '评论者ID',
    `parent_id` BIGINT COMMENT '父评论ID',
    `content` TEXT COMMENT '评论内容',
    `like_count` INT DEFAULT 0,
    `reply_count` INT DEFAULT 0,
    `status` TINYINT DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 话题表
CREATE TABLE `topic` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) UNIQUE NOT NULL COMMENT '话题名',
    `description` VARCHAR(200) COMMENT '话题描述',
    `icon` VARCHAR(500) COMMENT '话题图标',
    `post_count` INT DEFAULT 0 COMMENT '参与数量',
    `follow_count` INT DEFAULT 0 COMMENT '关注数量',
    `hot_score` INT DEFAULT 0 COMMENT '热度分',
    `status` TINYINT DEFAULT 1 COMMENT '状态',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 18.3 关系模块

```sql
-- 关注表
CREATE TABLE `follow` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `follower_id` BIGINT NOT NULL COMMENT '关注者ID',
    `following_id` BIGINT NOT NULL COMMENT '被关注者ID',
    `type` TINYINT DEFAULT 1 COMMENT '1关注 2悄悄关注',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_follow` (`follower_id`, `following_id`)
);

-- 点赞表
CREATE TABLE `like` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '点赞用户ID',
    `target_type` VARCHAR(20) NOT NULL COMMENT '目标类型 post/comment',
    `target_id` BIGINT NOT NULL COMMENT '目标ID',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_like` (`user_id`, `target_type`, `target_id`)
);

-- 收藏表
CREATE TABLE `favorite` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '收藏用户ID',
    `post_id` BIGINT NOT NULL COMMENT '动态ID',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_favorite` (`user_id`, `post_id`)
);
```

### 18.4 匹配模块

```sql
-- 滑动记录表
CREATE TABLE `swipe` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `swiper_id` BIGINT NOT NULL COMMENT '滑动者ID',
    `swiped_id` BIGINT NOT NULL COMMENT '被滑动者ID',
    `action` TINYINT NOT NULL COMMENT '1喜欢 2跳过 3超级喜欢',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_swipe` (`swiper_id`, `swiped_id`)
);

-- 匹配记录表
CREATE TABLE `match` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_a_id` BIGINT NOT NULL,
    `user_b_id` BIGINT NOT NULL,
    `match_type` TINYINT DEFAULT 1 COMMENT '1普通匹配 2超级喜欢',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_match` (`user_a_id`, `user_b_id`)
);
```

### 18.5 消息模块

```sql
-- 会话表
CREATE TABLE `conversation` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `type` TINYINT DEFAULT 1 COMMENT '1单聊 2群聊',
    `name` VARCHAR(100) COMMENT '群名称',
    `avatar` VARCHAR(500) COMMENT '群头像',
    `last_message_id` BIGINT COMMENT '最后消息ID',
    `last_message_at` DATETIME COMMENT '最后消息时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 会话成员表
CREATE TABLE `conversation_member` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `conversation_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `role` TINYINT DEFAULT 0 COMMENT '0普通 1群主 2管理员',
    `last_read_at` DATETIME COMMENT '最后已读时间',
    `join_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_member` (`conversation_id`, `user_id`)
);

-- 消息表
CREATE TABLE `message` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `conversation_id` BIGINT NOT NULL,
    `sender_id` BIGINT NOT NULL COMMENT '发送者ID',
    `type` TINYINT DEFAULT 1 COMMENT '1文字 2图片 3语音 4视频 5卡片 6阅后即焚',
    `content` TEXT COMMENT '消息内容',
    `media_url` VARCHAR(500) COMMENT '媒体URL',
    `duration` INT COMMENT '语音/视频时长',
    `burn_after_read` TINYINT DEFAULT 0 COMMENT '阅后即焚',
    `is_recalled` TINYINT DEFAULT 0 COMMENT '是否撤回',
    `read_at` DATETIME COMMENT '已读时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 19. API接口设计

### 19.1 认证模块

```
POST   /api/v1/auth/send-code       发送验证码
POST   /api/v1/auth/login           手机号登录
POST   /api/v1/auth/register        注册
POST   /api/v1/auth/refresh-token   刷新Token
POST   /api/v1/auth/logout          登出
```

### 19.2 用户模块

```
GET    /api/v1/users/me             获取我的信息
PUT    /api/v1/users/me             更新我的资料
GET    /api/v1/users/:uid           获取用户详情
PUT    /api/v1/users/me/avatar      上传头像
PUT    /api/v1/users/me/photos       上传照片
GET    /api/v1/users/me/visitors     获取访客列表
GET    /api/v1/users/search          搜索用户
POST   /api/v1/users/auth/real-name  实名认证
POST   /api/v1/users/auth/education  学历认证
```

### 19.3 动态模块

```
GET    /api/v1/posts/feed           获取Feed列表
GET    /api/v1/posts/:id            获取动态详情
POST   /api/v1/posts                发布动态
DELETE /api/v1/posts/:id            删除动态
GET    /api/v1/posts/user/:uid      获取用户动态列表
POST   /api/v1/posts/:id/like       点赞
DELETE /api/v1/posts/:id/like       取消点赞
POST   /api/v1/posts/:id/favorite   收藏
POST   /api/v1/posts/:id/share      分享
```

### 19.4 评论模块

```
GET    /api/v1/posts/:id/comments   获取评论列表
POST   /api/v1/posts/:id/comments   发表评论
PUT    /api/v1/comments/:id         编辑评论
DELETE /api/v1/comments/:id         删除评论
POST   /api/v1/comments/:id/like     点赞评论
```

### 19.5 短视频模块

```
GET    /api/v1/reels/feed            获取推荐视频流
GET    /api/v1/reels/:id             获取视频详情
POST   /api/v1/reels                 上传视频
DELETE /api/v1/reels/:id             删除视频
POST   /api/v1/reels/:id/like        点赞
POST   /api/v1/reels/:id/view        播放统计
POST   /api/v1/reels/:id/duet        合拍
GET    /api/v1/musics                获取音乐列表
```

### 19.6 故事模块

```
GET    /api/v1/stories/following     获取关注者故事
GET    /api/v1/stories/:id           获取故事详情
POST   /api/v1/stories               发布故事
DELETE /api/v1/stories/:id           删除故事
POST   /api/v1/stories/:id/view      标记已观看
```

### 19.7 匹配模块

```
GET    /api/v1/matches/recommend     获取推荐列表
POST   /api/v1/matches/swipe         滑动操作
GET    /api/v1/matches               获取匹配列表
GET    /api/v1/matches/:id           获取匹配详情
POST   /api/v1/matches/today-luck    今日缘分
GET    /api/v1/matches/who-liked-me  查看喜欢我的人(VIP)
```

### 19.8 消息模块

```
GET    /api/v1/conversations        获取会话列表
GET    /api/v1/conversations/:id     获取会话详情
POST   /api/v1/conversations         创建会话
GET    /api/v1/conversations/:id/messages 获取消息列表
POST   /api/v1/messages              发送消息
PUT    /api/v1/messages/:id/read     标记已读
DELETE /api/v1/messages/:id          撤回消息
POST   /api/v1/messages/:id/burn     阅后即焚
```

### 19.9 关系模块

```
POST   /api/v1/follows/:uid          关注用户
DELETE /api/v1/follows/:uid           取消关注
GET    /api/v1/follows/me/followers   获取我的粉丝
GET    /api/v1/follows/me/followings  获取我的关注
GET    /api/v1/follows/me/friends     获取我的好友
GET    /api/v1/users/:uid/followers  获取用户粉丝
GET    /api/v1/users/:uid/followings 获取用户关注
```

### 19.10 话题模块

```
GET    /api/v1/topics                获取话题列表
GET    /api/v1/topics/:id            获取话题详情
GET    /api/v1/topics/:id/posts      获取话题下的动态
POST   /api/v1/topics/:id/follow     关注话题
DELETE /api/v1/topics/:id/follow     取消关注
GET    /api/v1/topics/trending       获取热门话题
```

### 19.11 直播模块

```
GET    /api/v1/lives                 获取直播列表
GET    /api/v1/lives/:id             获取直播详情
POST   /api/v1/lives                 创建直播
PUT    /api/v1/lives/:id/end         结束直播
POST   /api/v1/lives/:id/gift        送礼物
POST   /api/v1/lives/:id/join        进入直播间
POST   /api/v1/lives/:id/leave       离开直播间
POST   /api/v1/lives/:id/comment     直播弹幕
```

### 19.12 会员模块

```
GET    /api/v1/vip/products          获取VIP产品列表
POST   /api/v1/vip/subscribe         订阅VIP
GET    /api/v1/vip/status            获取VIP状态
GET    /api/v1/wallet/balance       获取余额
POST   /api/v1/wallet/recharge       充值
GET    /api/v1/wallet/records        交易记录
GET    /api/v1/gifts                 获取礼物列表
```

---

## 20. 项目规划

### 20.1 里程碑

| 阶段 | 功能 | 周期 |
|------|------|------|
| v1.0 | 基础匹配+聊天 | 6周 |
| v2.0 | Feed+短视频+直播 | 10周 |
| v3.0 | 高级推荐+会员体系 | 6周 |
| v4.0 | 性能优化+安全加固 | 4周 |

### 20.2 团队规模

| 角色 | v1.0 | v2.0 | v3.0 |
|------|------|------|------|
| 前端iOS | 2 | 3 | 3 |
| 前端Android | 2 | 3 | 3 |
| 前端Web | 1 | 2 | 2 |
| 后端 | 4 | 6 | 6 |
| UI设计 | 2 | 2 | 1 |
| 产品 | 1 | 2 | 1 |
| 测试 | 1 | 3 | 3 |
| 运维 | 1 | 2 | 2 |

---

## 21. 附录

### 21.1 术语表

| 术语 | 说明 |
|------|------|
| Feed | 信息流，动态列表 |
| DAU | 日活跃用户 |
| MAU | 月活跃用户 |
| ARPU | 每用户平均收入 |
| LTV | 用户生命周期价值 |
| 完播率 | 视频播放完成的比例 |
| CPM | 千次展示成本 |
| CTR | 点击通过率 |

### 21.2 参考产品

| 产品 | 参考点 |
|------|--------|
| Instagram | 内容美学、Stories、Reels |
| TikTok | 短视频Feed、拍摄工具 |
| X (Twitter) | 话题讨论、实时性 |
| Tinder | 滑动匹配、约会功能 |
| Clubhouse | 语音聊天室 |
| Bumble | 女性主导匹配 |

---

*文档版本：v2.0*
*最后更新：2024年1月*
*作者：HeartMatch 产品团队*
