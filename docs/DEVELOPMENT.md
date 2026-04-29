# HeartMatch 开发笔记

本文档记录开发过程中的重要决策、问题和解决方案。

---

## 用户登录注册逻辑

### 当前行为
- **一个手机号对应一个账户**：同一手机号多次登录不会创建新账户
- **老用户登录**：直接返回已保存的数据，跳过/简化资料完善步骤
- **新用户登录**：必须填写昵称才能完成注册

### 代码位置
- **后端**：`microservices/user-service/src/main/java/com/heartmatch/service/AuthService.java`
- **前端**：`frontend/src/pages/auth/LoginPage.jsx`
- **Token 响应**：`microservices/user-service/src/main/java/com/heartmatch/dto/TokenResponse.java`（新增 `isNewUser` 字段）

### Redis Key 格式
```
sms:code:{手机号}:{类型}  # 验证码，5分钟有效期
token:{用户ID}           # 访问令牌，24小时有效期
```

---

## 已修复的 Bug

### 1. Profile 页面空白问题
**问题**：访问 `/profile` 页面显示空白
**原因**：
- 后端 `@PathVariable` 需要显式指定参数名
- 前端使用 `id` 而非 `uid` 查询用户资料

**修复**：
```java
// UserController.java
@GetMapping("/{uid}")
public ApiResponse getUserByUid(@PathVariable("uid") String uid)  // ✅ 显式指定
```

```jsx
// ProfilePage.jsx
const profileUid = uid || currentUser?.uid;  // ✅ 使用 uid
```

### 2. lucide-react 图标导入错误
**问题**：`Comment` 图标不存在于 lucide-react
**修复**：`DiscoverPage.jsx`
```jsx
import { MessageCircle } from 'lucide-react';  // ✅ 替换 Comment
```

---

## API 端点整理

### 认证相关 `/api/v1/auth/`
| 端点 | 方法 | 说明 |
|------|------|------|
| `/send-code` | POST | 发送验证码 |
| `/login` | POST | 手机号登录（返回 isNewUser 标识） |
| `/refresh-token` | POST | 刷新 Token |
| `/logout` | POST | 退出登录 |

### 用户相关 `/api/v1/users/`
| 端点 | 方法 | 说明 |
|------|------|------|
| `/me` | GET | 获取当前用户信息 |
| `/me` | PUT | 更新个人资料 |
| `/{uid}` | GET | 获取指定用户资料（使用 uid 非 id） |
| `/me/avatar` | PUT | 上传头像 |
| `/me/photos` | PUT | 上传照片 |

---

## 前端状态管理

### Store 文件
- `stores/authStore.js` - 认证状态、登录/登出
- `stores/userStore.js` - 用户资料、帖子
- `stores/matchStore.js` - 匹配相关
- `stores/imStore.js` - 即时通讯
- `stores/momentStore.js` - 动态

### 认证流程
1. 用户输入手机号 → 发送验证码到 Redis
2. 用户输入验证码 → 调用 `/api/v1/auth/login`
3. 后端返回 `accessToken`、`refreshToken`、`userInfo`、`isNewUser`
4. 前端存储 token 到 localStorage，更新 Zustand store
5. API 请求通过 axios 拦截器自动注入 token

---

## 数据库表

### user-service (heartmatch_user)
```sql
user                    -- 用户基础信息
user_profile           -- 用户详细资料
user_photo             -- 用户照片
user_interest          -- 兴趣标签
```

---

## 开发调试技巧

### 查看 Redis 验证码
```bash
docker exec heartmatch-redis redis-cli GET "sms:code:手机号:1"
docker exec heartmatch-redis redis-cli KEYS "*code*"
```

### 查看用户服务日志
```bash
# 服务运行在 PID 27245
tail -f /proc/27245/fd/1
```

### 重启用户服务
```bash
lsof -i :8081 -t | xargs -r kill
cd microservices/user-service && mvn compile && mvn spring-boot:run
```

---

## 待完成功能

- [ ] 完善用户搜索功能
- [ ] 实现 WebSocket 即时通讯
- [ ] 添加内容审核系统
- [ ] 实现推送通知
- [ ] 单元测试

---

## 注意事项

1. **@PathVariable**：Java 21 编译时参数名不会保留，必须显式指定
2. **前端热更新**：某些修改可能需要 Ctrl+Shift+R 强制刷新
3. **Token 刷新**：401 错误时会自动尝试刷新 token，失败则跳转登录页
