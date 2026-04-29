# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

HeartMatch 心动匹配是一款恋爱交友应用，包含 **Spring Boot 微服务后端**和 **React 前端**。

### 目录结构

```
/home/lisca/dev-ai/
├── microservices/     # 8 个 Spring Boot 微服务
├── frontend/          # React + Vite + Tailwind CSS 应用
├── docs/              # 技术规格文档
├── docker-compose.yml # 容器编排（MySQL + Redis）
└── CLAUDE.md
```

## 开发环境启动

### 1. 启动基础设施（Docker）

```bash
cd /home/lisca/dev-ai

# 如果容器已存在，直接启动
docker start heartmatch-mysql heartmatch-redis

# 如果容器不存在，创建并启动
docker run -d --name heartmatch-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=heartmatch_user -p 3306:3306 mysql:8.0
docker run -d --name heartmatch-redis -p 6379:6379 redis:7-alpine

# 验证服务状态
docker ps

# 查看 Redis 中的验证码（开发调试用）
docker exec heartmatch-redis redis-cli GET "sms:code:{手机号}:1"
docker exec heartmatch-redis redis-cli KEYS "*code*"
```

### 2. 启动后端微服务

```bash
cd /home/lisca/dev-ai/microservices

# 启动核心服务（后台运行）
mvn spring-boot:run -pl gateway,user-service,content-service -DskipTests &

# 或分别启动
mvn spring-boot:run -pl gateway -DskipTests &
mvn spring-boot:run -pl user-service -DskipTests &
mvn spring-boot:run -pl content-service -DskipTests &
```

### 3. 启动前端

```bash
cd /home/lisca/dev-ai/frontend
npm install  # 仅首次或依赖变更时
npm run dev  # 开发服务器
```

### 服务端口映射

| 服务 | 端口 | 说明 |
|------|------|------|
| gateway | 8080 | API 网关（所有前端请求的入口） |
| user-service | 8081 | 用户注册、认证、资料 |
| content-service | 8082 | 动态、评论 |
| match-service | 8083 | 滑动匹配 |
| im-service | 8084 | 即时通讯 |
| video-service | 8085 | 短视频 |
| live-service | 8086 | 直播 |
| pay-service | 8087 | VIP、钱包 |
| Frontend | 5173 | Vite 开发服务器 |

## 架构

### 微服务结构

```
microservices/{service}/src/main/java/com/heartmatch/
├── {ServiceName}Application.java  # 启动类
├── config/                        # 配置（Redis、Web）
├── controller/                    # REST 端点（注意 @PathVariable 需显式指定名称）
├── service/                       # 业务逻辑
├── repository/                    # MyBatis-Plus 数据访问
├── entity/                        # 数据库实体
├── dto/                           # 请求/响应 DTO
└── common/                        # 通用工具
```

### 前端结构

```
frontend/src/
├── pages/           # 路由页面（auth/, profile/, match/, chat/, discover/）
├── store/           # Zustand 状态管理（authStore.js, userStore.js 等）
├── services/        # API 客户端（api.js 含 axios 拦截器）
├── components/      # 共享组件
└── styles/          # Tailwind CSS 配置
```

### 前端技术细节
- **Tailwind CSS v4**: 配置在 `postcss.config.js`，使用 `@tailwindcss/postcss` 插件
- **ESLint**: 配置在 `eslint.config.js`
- **环境变量**: `.env` 文件配置 API Key，变量名需以 `VITE_` 开头

## 认证与授权

### 认证流程（分离注册+登录）

**注册流程**：手机号+验证码 → 设置账户名+密码
1. 发送验证码到手机 `/api/v1/auth/send-code`
2. 验证手机号 `/api/v1/auth/verify-code`
3. 设置账户信息 `/api/v1/auth/register`

**登录流程**：支持两种方式
- 账户密码登录：`/api/v1/auth/login/account`
- 手机验证码登录：`/api/v1/auth/login/sms`

### JWT + Redis Token 机制

- 验证码存储在 Redis：`sms:code:{手机号}:{类型}`，5分钟有效
- Token 存储在 Redis：`token:{用户ID}`，24小时有效
- Token 通过 `X-User-Id` 请求头传递给下游服务

### 前端认证状态

- `stores/authStore.js`：Zustand store，管理登录状态和用户信息
- Token 存储在 localStorage
- 受保护路由检查 `auth.isLoggedIn`

## API 集成

### API 响应格式
```java
// 成功响应
{"code":200,"message":"success","data":{...},"timestamp":...}

// 错误响应
{"code":500,"message":"错误信息","timestamp":...}
```

### API 路由前缀
所有 API 统一通过网关访问，路径前缀 `/api/v1/`：
- `/api/v1/auth/*` → user-service
- `/api/v1/users/*` → user-service
- `/api/v1/posts/*` → content-service

### 图片上传
- 使用 imgBB 免费图床
- API Key 配置在 `frontend/.env`：`VITE_IMGBB_API_KEY`
- 上传服务：`frontend/src/services/imageUpload.js`

## 数据库

### Redis Key 规范
- 验证码：`sms:code:{手机号}:{类型}`
- Token：`token:{用户ID}`

### 微服务数据库对应
| 数据库名 | 服务 | 主要表 |
|----------|------|--------|
| heartmatch_user | user-service | user, user_profile, user_photo |
| heartmatch_content | content-service | post, comment, topic |
| heartmatch_match | match-service | swipe_record, match_result |
| heartmatch_im | im-service | conversation, message |
| heartmatch_video | video-service | video, video_comment |
| heartmatch_pay | pay-service | vip_order, wallet |

## 常见开发问题

### @PathVariable 需要显式名称
```java
// 正确
@GetMapping("/{uid}")
public ApiResponse getUser(@PathVariable("uid") String uid)

// 错误（Java 17 编译选项问题）
@GetMapping("/{uid}")
public ApiResponse getUser(@PathVariable String uid)
```

### 前端修改热更新
Vite 支持热更新，但某些情况下需刷新页面（Ctrl+Shift+R 强制刷新）。

### 后端修改需重启
修改 Java 代码后需重新编译：
```bash
cd microservices/{service} && mvn compile
```

## Feed 模块

### 后端 API
- `GET /api/v1/posts/feed` - 获取 Feed 列表（支持 recommend/following/video 类型）
- `POST /api/v1/posts` - 发布动态（支持图文/视频/故事）
- `POST /api/v1/posts/:id/like` - 点赞
- `POST /api/v1/posts/:id/favorite` - 收藏
- `POST /api/v1/posts/:id/share` - 分享（增加分享数）
- `POST /api/v1/posts/:id/view` - 浏览统计
- `GET /api/v1/posts/:id/comments` - 获取评论列表
- `POST /api/v1/posts/:id/comments` - 发表/回复评论
- `GET /api/v1/topics/trending` - 热门话题
- `GET /api/v1/stories/following` - 关注者故事

### 推荐算法
```
Score = (互动分 × 0.4) + (关系分 × 0.3) + (新鲜分 × 0.2) + (热度分 × 0.1)
```

### 前端组件
- `FeedCard` - 动态卡片（点赞/收藏/分享/关注）
- `CommentList` - 评论列表（支持嵌套回复）
- `StoriesBar` - 故事栏
- `TopicSquarePage` - 话题广场（`/topics`）

## 代码风格

### 后端
- 使用 Lombok 减少样板代码
- MyBatis-Plus 的 LambdaQueryWrapper 进行查询
- 统一使用 `ApiResponse.success(data)` 返回
- 密码使用 MD5 + salt 存储

### 前端
- Tailwind CSS 工具类优先
- Zustand 进行状态管理
- 组件使用 `useParams` 获取 URL 参数
- 图片使用 imgBB 图床服务
