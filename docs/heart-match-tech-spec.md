# 心动社交 (HeartMatch) 技术规格文档 v2.0

> 本文档聚焦技术架构与实现细节。
> 产品功能需求请参考 [heart-match-product-req.md](./heart-match-product-req.md)

---

## 1. 技术架构总览

### 1.1 微服务架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户端                                │
│     iOS / Android / Web / 小程序                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway (Port 8080)                 │
│              Spring Cloud Gateway + JWT认证                   │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────┬─────────┬─────────┬─────────┬─────────┐
        ▼         ▼         ▼         ▼         ▼         ▼
┌───────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ 用户服务   │ │ 内容服务│ │ 匹配服务│ │ IM服务 │ │ 视频服务│ │ 直播服务│
│user-service│content- │match-   │im-service│video-   │live-    │
│ Port:8081 │ │service  │service  │Port:8084│service  │service  │
│           │ │Port:8082│Port:8083│         │Port:8085│Port:8086│
└─────┬─────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
      │           │           │           │           │           │
      ▼           ▼           ▼           ▼           ▼           ▼
┌───────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│heartmatch_│ │heartmatch│heartmatch│heartmatch│heartmatch│heartmatch│
│   _user   │ │_content ││  _match ││   _im   ││  _video ││  _live  │
│ (MySQL)   │ │(MySQL)  ││ (MySQL) ││ (MySQL) ││ (MySQL) ││ (MySQL) │
│           │ │+Redis   ││ +Redis  ││ +Redis  ││ +Redis  ││ +Redis  │
└───────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
                                                                    │
                                                              ┌────────┐
                                                              │pay-svc │
                                                              │Port:8087│
                                                              │_pay DB │
                                                              └────────┘
```

### 1.2 服务端口映射

| 服务 | 端口 | 数据库 | 说明 |
|------|------|--------|------|
| gateway | 8080 | - | API网关，统一入口 |
| user-service | 8081 | heartmatch_user | 用户注册、认证、资料 |
| content-service | 8082 | heartmatch_content | 动态、评论、话题、故事 |
| match-service | 8083 | heartmatch_match | 滑动匹配、智能推荐 |
| im-service | 8084 | heartmatch_im | 即时通讯、消息 |
| video-service | 8085 | heartmatch_video | 短视频、Reels |
| live-service | 8086 | heartmatch_live | 直播、弹幕、打赏 |
| pay-service | 8087 | heartmatch_pay | VIP、钱包、礼物 |

### 1.3 前端技术栈

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

### 1.4 后端技术栈

| 类型 | 技术 | 说明 |
|------|------|------|
| 框架 | Spring Boot 3.x | 核心框架 |
| 网关 | Spring Cloud Gateway | 统一路由 |
| ORM | MyBatis-Plus | 数据访问 |
| 数据库 | MySQL 8.0 | 主数据库 |
| 缓存 | Redis 7.x | 缓存/会话 |
| 消息队列 | RocketMQ | 异步消息 |
| 文件存储 | MinIO / OSS | 文件存储 |
| 安全 | Spring Security + JWT | 认证授权 |
| 日志 | ELK Stack | 日志系统 |
| 监控 | Prometheus + Grafana | 监控告警 |
| 容器 | Docker + K8s | 容器编排 |

---

## 2. 微服务详细设计

### 2.1 API Gateway (网关服务)

**职责**：
- 统一入口，路由分发
- JWT Token 验证
- 限流、熔断
- CORS 跨域处理

**路由配置**：
```yaml
routes:
  - id: user-service
    uri: http://localhost:8081
    predicates:
      - Path=/api/v1/users/**,/api/v1/auth/**
  - id: content-service
    uri: http://localhost:8082
    predicates:
      - Path=/api/v1/posts/**,/api/v1/topics/**,/api/v1/stories/**
  - id: match-service
    uri: http://localhost:8083
    predicates:
      - Path=/api/v1/matches/**
  - id: im-service
    uri: http://localhost:8084
    predicates:
      - Path=/api/v1/conversations/**,/api/v1/messages/**
  - id: video-service
    uri: http://localhost:8085
    predicates:
      - Path=/api/v1/reels/**,/api/v1/musics/**
  - id: live-service
    uri: http://localhost:8086
    predicates:
      - Path=/api/v1/lives/**
  - id: pay-service
    uri: http://localhost:8087
    predicates:
      - Path=/api/v1/vip/**,/api/v1/wallet/**,/api/v1/gifts/**
```

**JWT认证过滤器**：
- 验证Token有效性
- 解析UserId注入请求头 `X-User-Id`
- 白名单路径放行

### 2.2 User Service (用户服务)

**模块结构**：
```
user-service/
├── controller/
│   ├── AuthController      # 认证: 发送验证码、登录、登出
│   ├── UserController       # 用户: 资料、头像、照片
│   └── FollowController     # 关注: 关注/取消关注
├── service/
│   ├── AuthService         # 验证码、登录
│   ├── UserService          # 用户资料管理
│   └── FollowService        # 关注关系
├── repository/
│   ├── UserRepository
│   ├── UserProfileRepository
│   ├── UserPhotoRepository
│   ├── FollowRepository
│   └── SmsCodeRepository
├── entity/
│   ├── User
│   ├── UserProfile
│   ├── UserAuth
│   ├── UserPhoto
│   ├── InterestTag
│   ├── UserInterest
│   └── Follow
└── dto/
    ├── SendCodeRequest
    ├── LoginRequest
    ├── TokenResponse
    ├── UserInfoResponse
    └── UpdateProfileRequest
```

**API接口**：
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/v1/auth/send-code | 发送验证码 |
| POST | /api/v1/auth/login | 手机号登录 |
| POST | /api/v1/auth/refresh-token | 刷新Token |
| POST | /api/v1/auth/logout | 登出 |
| GET | /api/v1/users/me | 获取我的信息 |
| PUT | /api/v1/users/me | 更新我的资料 |
| GET | /api/v1/users/{uid} | 获取用户详情 |
| PUT | /api/v1/users/me/avatar | 上传头像 |
| PUT | /api/v1/users/me/photos | 上传照片 |
| GET | /api/v1/users/me/photos | 获取照片列表 |
| DELETE | /api/v1/users/me/photos/{id} | 删除照片 |
| GET | /api/v1/users/search | 搜索用户 |
| POST | /api/v1/follows/{uid} | 关注用户 |
| DELETE | /api/v1/follows/{uid} | 取消关注 |

### 2.3 Content Service (内容服务)

**模块结构**：
```
content-service/
├── controller/
│   ├── PostController       # 动态: 发布、Feed、点赞、收藏
│   ├── CommentController    # 评论
│   ├── TopicController      # 话题
│   └── StoryController      # 故事
├── service/
│   ├── PostService          # 动态业务
│   ├── CommentService       # 评论业务
│   ├── TopicService         # 话题业务
│   └── StoryService         # 故事业务
├── entity/
│   ├── Post
│   ├── Comment
│   ├── Topic
│   ├── Story
│   ├── LikeRecord
│   └── Favorite
└── repository/
    ├── PostRepository
    ├── CommentRepository
    ├── TopicRepository
    └── ...
```

**API接口**：
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/posts/feed | 获取Feed列表 |
| GET | /api/v1/posts/{id} | 获取动态详情 |
| POST | /api/v1/posts | 发布动态 |
| DELETE | /api/v1/posts/{id} | 删除动态 |
| POST | /api/v1/posts/{id}/like | 点赞 |
| DELETE | /api/v1/posts/{id}/like | 取消点赞 |
| POST | /api/v1/posts/{id}/favorite | 收藏 |
| GET | /api/v1/posts/{id}/comments | 获取评论 |
| POST | /api/v1/posts/{id}/comments | 发表评论 |
| GET | /api/v1/topics | 话题列表 |
| GET | /api/v1/topics/trending | 热门话题 |

### 2.4 Match Service (匹配服务)

**模块结构**：
```
match-service/
├── controller/
│   └── MatchController      # 匹配、滑动
├── service/
│   └── MatchService         # 推荐算法、匹配逻辑
├── entity/
│   ├── Swipe
│   └── MatchRecord
└── repository/
    ├── SwipeRepository
    └── MatchRecordRepository
```

**API接口**：
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/matches/recommend | 获取推荐列表 |
| POST | /api/v1/matches/swipe | 滑动操作 |
| GET | /api/v1/matches | 获取匹配列表 |
| POST | /api/v1/matches/today-luck | 今日缘分 |

**匹配规则**：
- action=1: 喜欢 (消耗喜欢次数)
- action=2: 跳过 (免费)
- action=3: 超级喜欢 (消耗超级喜欢次数)
- 双方都喜欢则创建匹配记录

### 2.5 IM Service (即时通讯服务)

**模块结构**：
```
im-service/
├── controller/
│   ├── ConversationController  # 会话管理
│   └── MessageController       # 消息管理
├── service/
│   ├── ConversationService     # 会话业务
│   └── MessageService          # 消息业务
├── entity/
│   ├── Conversation
│   ├── ConversationMember
│   └── Message
└── repository/
    ├── ConversationRepository
    ├── ConversationMemberRepository
    └── MessageRepository
```

**API接口**：
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/conversations | 会话列表 |
| POST | /api/v1/conversations | 创建会话 |
| GET | /api/v1/conversations/{id} | 会话详情 |
| GET | /api/v1/conversations/{id}/messages | 消息列表 |
| POST | /api/v1/messages | 发送消息 |
| PUT | /api/v1/messages/{id}/read | 标记已读 |
| DELETE | /api/v1/messages/{id} | 撤回消息 |
| POST | /api/v1/messages/{id}/burn | 阅后即焚 |

**消息类型**：1文字 2图片 3语音 4视频 5卡片 6阅后即焚

### 2.6 Video Service (短视频服务)

**模块结构**：
```
video-service/
├── controller/
│   ├── VideoController     # 视频管理
│   └── MusicController    # 音乐库
├── service/
│   ├── VideoService       # 视频业务
│   └── MusicService       # 音乐业务
├── entity/
│   ├── Video
│   ├── VideoComment
│   └── VideoLike
└── repository/
    ├── VideoRepository
    ├── VideoCommentRepository
    └── VideoLikeRepository
```

**API接口**：
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/reels/feed | 推荐视频流 |
| GET | /api/v1/reels/{id} | 视频详情 |
| POST | /api/v1/reels | 上传视频 |
| DELETE | /api/v1/reels/{id} | 删除视频 |
| POST | /api/v1/reels/{id}/like | 点赞 |
| POST | /api/v1/reels/{id}/view | 播放统计 |
| GET | /api/v1/musics | 获取音乐列表 |

### 2.7 Live Service (直播服务)

**模块结构**：
```
live-service/
├── controller/
│   └── LiveController     # 直播管理
├── service/
│   ├── LiveRoomService   # 直播间业务
│   └── LiveInteractionService  # 互动业务
├── entity/
│   ├── LiveRoom
│   ├── LiveGift
│   ├── LiveGiftRecord
│   └── LiveBarrage
└── repository/
    ├── LiveRoomRepository
    ├── LiveGiftRepository
    └── ...
```

**API接口**：
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/lives | 直播列表 |
| GET | /api/v1/lives/{id} | 直播详情 |
| POST | /api/v1/lives | 创建直播 |
| PUT | /api/v1/lives/{id}/end | 结束直播 |
| POST | /api/v1/lives/{id}/join | 进入直播间 |
| POST | /api/v1/lives/{id}/leave | 离开直播间 |
| POST | /api/v1/lives/{id}/comment | 弹幕 |
| POST | /api/v1/lives/{id}/gift | 送礼物 |
| GET | /api/v1/lives/gifts | 礼物列表 |

### 2.8 Pay Service (支付服务)

**模块结构**：
```
pay-service/
├── controller/
│   ├── VipController      # VIP订阅
│   ├── WalletController  # 钱包
│   └── GiftController    # 礼物
├── service/
│   ├── VipService        # VIP业务
│   ├── WalletService     # 钱包业务
│   └── GiftService       # 礼物业务
├── entity/
│   ├── VipOrder
│   ├── Wallet
│   ├── RechargeRecord
│   └── Gift
└── repository/
    ├── VipOrderRepository
    ├── WalletRepository
    └── ...
```

**API接口**：
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/vip/products | VIP产品列表 |
| POST | /api/v1/vip/subscribe | 订阅VIP |
| GET | /api/v1/vip/status | VIP状态 |
| GET | /api/v1/wallet/balance | 余额 |
| POST | /api/v1/wallet/recharge | 充值 |
| GET | /api/v1/wallet/records | 交易记录 |
| GET | /api/v1/gifts | 礼物列表 |

**VIP产品**：
| 产品 | 价格 | 有效期 |
|------|------|--------|
| 月卡 | ¥25 | 30天 |
| 年卡 | ¥198 | 365天 |

---

## 3. 数据库设计

### 3.1 用户服务数据库 (heartmatch_user)

```sql
-- 用户基础表
CREATE TABLE `user` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `uid` VARCHAR(32) UNIQUE NOT NULL,
    `phone` VARCHAR(20) UNIQUE,
    `nickname` VARCHAR(50),
    `avatar` VARCHAR(500),
    `gender` TINYINT DEFAULT 0,
    `birthday` DATE,
    `bio` VARCHAR(200),
    `status` TINYINT DEFAULT 1,
    `vip_level` TINYINT DEFAULT 0,
    `vip_expire_at` DATETIME,
    `last_active_at` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    INDEX idx_status, idx_gender
);

-- 用户资料表
CREATE TABLE `user_profile` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED UNIQUE,
    `height` INT, `weight` INT,
    `job` VARCHAR(100), `income` VARCHAR(50),
    `education` VARCHAR(20), `school` VARCHAR(100),
    `city` VARCHAR(50), `longitude` DECIMAL(10,7), `latitude` DECIMAL(10,7),
    `marriage` TINYINT, `smoking` TINYINT, `drinking` TINYINT, `hometown` VARCHAR(50)
);

-- 关注表
CREATE TABLE `follow` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `follower_id` BIGINT UNSIGNED,
    `following_id` BIGINT UNSIGNED,
    `type` TINYINT DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_follow (`follower_id`, `following_id`)
);
```

### 3.2 内容服务数据库 (heartmatch_content)

```sql
-- 动态表
CREATE TABLE `post` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `content` TEXT,
    `type` TINYINT DEFAULT 1 COMMENT '1图文 2视频 3故事',
    `media_urls` JSON,
    `music_id` BIGINT, `music_title` VARCHAR(100),
    `location` VARCHAR(100), `topic_id` BIGINT,
    `like_count` INT DEFAULT 0, `comment_count` INT DEFAULT 0,
    `share_count` INT DEFAULT 0, `view_count` INT DEFAULT 0,
    `status` TINYINT DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_created, idx_type_created
);

-- 评论表
CREATE TABLE `comment` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `post_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `parent_id` BIGINT,
    `content` TEXT,
    `like_count` INT DEFAULT 0, `reply_count` INT DEFAULT 0,
    `status` TINYINT DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 话题表
CREATE TABLE `topic` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) UNIQUE NOT NULL,
    `description` VARCHAR(200),
    `post_count` INT DEFAULT 0, `follow_count` INT DEFAULT 0,
    `hot_score` INT DEFAULT 0,
    `status` TINYINT DEFAULT 1
);
```

### 3.3 匹配服务数据库 (heartmatch_match)

```sql
-- 滑动记录表
CREATE TABLE `swipe` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `swiper_id` BIGINT UNSIGNED NOT NULL,
    `swiped_id` BIGINT UNSIGNED NOT NULL,
    `action` TINYINT NOT NULL COMMENT '1喜欢 2跳过 3超级喜欢',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_swipe (`swiper_id`, `swiped_id`),
    INDEX idx_swiped_action (`swiped_id`, `action`)
);

-- 匹配记录表
CREATE TABLE `match_record` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `user_a_id` BIGINT UNSIGNED NOT NULL,
    `user_b_id` BIGINT UNSIGNED NOT NULL,
    `match_type` TINYINT DEFAULT 1 COMMENT '1普通 2超级喜欢',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_match (`user_a_id`, `user_b_id`)
);
```

### 3.4 IM服务数据库 (heartmatch_im)

```sql
-- 会话表
CREATE TABLE `conversation` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `type` TINYINT DEFAULT 1 COMMENT '1单聊 2群聊',
    `name` VARCHAR(100), `avatar` VARCHAR(500),
    `last_message_id` BIGINT,
    `last_message_at` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 会话成员表
CREATE TABLE `conversation_member` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `conversation_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `role` TINYINT DEFAULT 0,
    `last_read_at` DATETIME,
    `join_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_member (`conversation_id`, `user_id`)
);

-- 消息表
CREATE TABLE `message` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `conversation_id` BIGINT UNSIGNED NOT NULL,
    `sender_id` BIGINT UNSIGNED NOT NULL,
    `type` TINYINT DEFAULT 1 COMMENT '1文字 2图片 3语音 4视频',
    `content` TEXT, `media_url` VARCHAR(500),
    `duration` INT, `burn_after_read` TINYINT DEFAULT 0,
    `is_recalled` TINYINT DEFAULT 0,
    `read_at` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_conv_created (`conversation_id`, `created_at`)
);
```

---

## 4. 缓存策略

### 4.1 Redis使用场景

| 服务 | Key Pattern | TTL | 说明 |
|------|-------------|-----|------|
| user | user:session:{userId} | 7天 | 用户会话 |
| user | sms:code:{phone}:{type} | 5分钟 | 验证码 |
| content | like:{userId}:{postId} | 24小时 | 点赞状态 |
| match | match:like:{userId} | 每日重置 | 今日喜欢次数 |
| im | im:unread:{userId}:{convId} | 30分钟 | 未读数 |
| video | video:view:{videoId} | - | 播放计数 |

### 4.2 限流规则

| 场景 | 限制 | 重置周期 |
|------|------|----------|
| 发送验证码 | 5次/手机号 | 1小时 |
| 发送消息 | 100条/用户 | 1分钟 |
| 喜欢次数 | 100次/用户 | 每日 |
| 超级喜欢 | 3次/用户 | 每日 |

---

## 5. 项目结构

### 5.1 微服务目录

```
/home/lisca/dev-ai/microservices/
├── pom.xml                    # 父POM
├── gateway/                   # API网关 (8080)
│   ├── pom.xml
│   └── src/main/
├── user-service/              # 用户服务 (8081)
│   ├── pom.xml
│   └── src/main/
├── content-service/            # 内容服务 (8082)
│   ├── pom.xml
│   └── src/main/
├── match-service/             # 匹配服务 (8083)
│   ├── pom.xml
│   └── src/main/
├── im-service/                # IM服务 (8084)
│   ├── pom.xml
│   └── src/main/
├── video-service/             # 视频服务 (8085)
│   ├── pom.xml
│   └── src/main/
├── live-service/              # 直播服务 (8086)
│   ├── pom.xml
│   └── src/main/
├── pay-service/               # 支付服务 (8087)
│   ├── pom.xml
│   └── src/main/
└── scripts/                   # 数据库初始化脚本
    ├── user-service.sql
    ├── content-service.sql
    ├── init_match_db.sql
    ├── init_im_db.sql
    ├── init_live_db.sql
    └── init_pay_db.sql
```

### 5.2 服务内部结构

每个服务遵循统一结构：
```
service-name/
├── pom.xml
└── src/main/
    ├── java/com/heartmatch/
    │   ├── {ServiceName}Application.java   # 启动类
    │   ├── config/                          # 配置类
    │   ├── controller/                      # 控制器
    │   ├── service/                         # 业务逻辑
    │   ├── repository/                     # 数据访问
    │   ├── entity/                        # 实体类
    │   ├── dto/                           # 数据传输对象
    │   └── common/                        # 通用类
    └── resources/
        ├── application.yml                # 配置文件
        └── mapper/                        # XML映射文件(可选)
```

---

## 6. 开发规范

### 6.1 通用规范

- **Java版本**: JDK 17+
- **Spring Boot**: 3.2.x
- **命名规范**: 驼峰命名
- **API版本**: /api/v1/
- **响应格式**: {code: 200, message: "success", data: {...}, timestamp: long}

### 6.2 数据库规范

- 主键: BIGINT UNSIGNED AUTO_INCREMENT
- 时间: DATETIME DEFAULT CURRENT_TIMESTAMP
- 软删除: deleted_at DATETIME
- 索引: idx_{column}, uk_{columns}

### 6.3 安全规范

- 所有接口需JWT认证(白名单除外)
- 敏感数据加密存储
- 防SQL注入、XSS攻击
- 请求限流

---

## 7. 部署

### 7.1 环境配置

| 环境 | MySQL | Redis | 说明 |
|------|-------|-------|------|
| dev | localhost:3306 | localhost:6379 | 开发环境 |
| test | test-mysql:3306 | test-redis:6379 | 测试环境 |
| prod | prod-mysql:3306 | prod-redis:6379 | 生产环境 |

### 7.2 启动命令

```bash
# 根目录编译
cd /home/lisca/dev-ai/microservices
mvn clean install

# 启动各服务
cd gateway && mvn spring-boot:run &
cd user-service && mvn spring-boot:run &
cd content-service && mvn spring-boot:run &
# ... 其他服务
```

---

*文档版本：v2.0 - 微服务版*
*最后更新：2026年4月*
*作者：HeartMatch 技术团队*