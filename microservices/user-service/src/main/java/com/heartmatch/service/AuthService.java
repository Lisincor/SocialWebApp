package com.heartmatch.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.heartmatch.entity.User;
import com.heartmatch.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${jwt.secret:heartmatch-secret-key-2024}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private long jwtExpiration;

    private static final String JWT_SECRET_FULL = "heartmatch-secret-key-2024-must-be-at-least-256-bits-long-for-hs256";

    // ==================== 发送验证码 ====================

    /**
     * 发送验证码
     */
    public void sendCode(String phone, Integer type) {
        // 生成6位验证码
        String code = String.valueOf((int) ((Math.random() * 9 + 1) * 100000));

        // 存储到Redis，5分钟有效
        String key = "sms:code:" + phone + ":" + type;
        redisTemplate.opsForValue().set(key, code, 5, TimeUnit.MINUTES);

        log.info("发送验证码到 {}: {}", phone, code);
        // 实际项目中应调用短信网关
    }

    // ==================== 注册流程 ====================

    /**
     * 验证注册验证码（验证手机号是否有效）
     */
    public boolean verifyRegisterCode(String phone, String code) {
        if (code == null || code.isEmpty()) {
            throw new RuntimeException("验证码不能为空");
        }
        String key = "sms:code:" + phone + ":1";
        String storedCode = (String) redisTemplate.opsForValue().get(key);

        if (storedCode == null || !storedCode.equals(code)) {
            throw new RuntimeException("验证码错误或已过期");
        }
        return true;
    }

    /**
     * 创建新用户（设置账户名和密码）
     */
    public Map<String, Object> register(String phone, String code, String username, String password, String nickname, Integer gender) {
        // 验证验证码
        verifyRegisterCode(phone, code);

        // 检查手机号是否已注册
        User existingPhoneUser = userRepository.selectOne(
            new LambdaQueryWrapper<User>().eq(User::getPhone, phone)
        );
        if (existingPhoneUser != null) {
            throw new RuntimeException("该手机号已注册，请直接登录");
        }

        // 检查账户名是否唯一
        User existingUsernameUser = userRepository.selectOne(
            new LambdaQueryWrapper<User>().eq(User::getUsername, username)
        );
        if (existingUsernameUser != null) {
            throw new RuntimeException("该账户名已被占用，请换一个");
        }

        // 创建新用户
        User user = new User();
        user.setUid(UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        user.setPhone(phone);
        user.setUsername(username);
        user.setPassword(hashPassword(password));
        user.setNickname(nickname != null && !nickname.isEmpty() ? nickname : username);
        user.setGender(gender != null ? gender : 0);
        user.setStatus(1);
        user.setVipLevel(0);
        userRepository.insert(user);

        log.info("新用户注册成功: phone={}, username={}", phone, username);

        // 生成Token并返回
        return generateTokenResponse(user, true);
    }

    // ==================== 登录流程 ====================

    /**
     * 账户密码登录
     */
    public Map<String, Object> loginByAccount(String username, String password) {
        // 查找用户
        User user = userRepository.selectOne(
            new LambdaQueryWrapper<User>().eq(User::getUsername, username)
        );

        if (user == null) {
            throw new RuntimeException("账户不存在或密码错误");
        }

        // 验证密码
        if (password.equals(user.getPassword())) {
            throw new RuntimeException("账户不存在密码错误");
        }

        // 检查账号状态
        if (user.getStatus() != 1) {
            throw new RuntimeException("账号已被禁用");
        }

        // 更新最后活跃时间
        user.setLastActiveAt(LocalDateTime.now());
        userRepository.updateById(user);

        log.info("用户登录: username={}", username);
        return generateTokenResponse(user, false);
    }

    /**
     * 手机号验证码登录
     */
    public Map<String, Object> loginBySms(String phone, String code) {
        // 验证验证码
        if (code == null || code.isEmpty()) {
            throw new RuntimeException("验证码不能为空");
        }
        String key = "sms:code:" + phone + ":1";
        String storedCode = (String) redisTemplate.opsForValue().get(key);
        if (storedCode == null || !storedCode.equals(code)) {
            throw new RuntimeException("验证码错误或已过期");
        }

        // 查找用户
        User user = userRepository.selectOne(
            new LambdaQueryWrapper<User>().eq(User::getPhone, phone)
        );

        if (user == null) {
            throw new RuntimeException("该手机号未注册，请先注册");
        }

        // 检查账号状态
        if (user.getStatus() != 1) {
            throw new RuntimeException("账号已被禁用");
        }

        // 更新最后活跃时间
        user.setLastActiveAt(LocalDateTime.now());
        userRepository.updateById(user);

        log.info("用户登录: phone={}", phone);
        return generateTokenResponse(user, false);
    }

    // ==================== 密码管理 ====================

    /**
     * 修改密码
     */
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 如果有旧密码，验证旧密码
        if (oldPassword != null && !oldPassword.isEmpty() && user.getPassword() != null) {
            if (!hashPassword(oldPassword).equals(user.getPassword())) {
                throw new RuntimeException("原密码错误");
            }
        }

        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("新密码长度不能少于6位");
        }

        user.setPassword(hashPassword(newPassword));
        userRepository.updateById(user);
        log.info("用户 {} 修改了密码", userId);
    }

    // ==================== Token管理 ====================

    /**
     * 生成Token响应
     */
    private Map<String, Object> generateTokenResponse(User user, boolean isNewUser) {
        String accessToken = generateJwtToken(user.getId(), false);
        String refreshToken = generateJwtToken(user.getId(), true);

        // 存储到Redis
        redisTemplate.opsForValue().set("token:" + user.getId(), accessToken, 24, TimeUnit.HOURS);

        Map<String, Object> result = new HashMap<>();
        result.put("accessToken", accessToken);
        result.put("refreshToken", refreshToken);
        result.put("expiresIn", jwtExpiration / 1000);
        result.put("isNewUser", isNewUser);
        result.put("userId", user.getId());
        result.put("username", user.getUsername());
        result.put("phone", user.getPhone());

        return result;
    }

    /**
     * 生成JWT Token
     */
    private String generateJwtToken(Long userId, boolean isRefresh) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + (isRefresh ? jwtExpiration * 10 : jwtExpiration));

        return Jwts.builder()
            .subject(String.valueOf(userId))
            .claim("userId", userId)
            .claim("type", isRefresh ? "refresh" : "access")
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(Keys.hmacShaKeyFor(JWT_SECRET_FULL.getBytes(StandardCharsets.UTF_8)))
            .compact();
    }

    /**
     * 刷新Token
     */
    public String refreshToken(String refreshToken, Long userId) {
        return generateJwtToken(userId, false);
    }

    /**
     * 登出
     */
    public void logout(Long userId) {
        redisTemplate.delete("token:" + userId);
    }

    // ==================== 工具方法 ====================

    /**
     * MD5哈希密码
     */
    private String hashPassword(String password) {
        if (password == null) return null;
        return DigestUtils.md5DigestAsHex((password + "heartmatch_salt").getBytes(StandardCharsets.UTF_8));
    }
}
