-- 用户服务数据库
CREATE DATABASE IF NOT EXISTS heartmatch_user DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE heartmatch_user;

-- 用户基础表
CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `uid` VARCHAR(32) NOT NULL COMMENT '用户UID',
    `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    `password` VARCHAR(128) DEFAULT NULL COMMENT '密码',
    `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
    `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像',
    `gender` TINYINT DEFAULT 0 COMMENT '性别',
    `birthday` DATE DEFAULT NULL COMMENT '生日',
    `bio` VARCHAR(200) DEFAULT NULL COMMENT '签名',
    `status` TINYINT DEFAULT 1 COMMENT '状态',
    `vip_level` TINYINT DEFAULT 0 COMMENT 'VIP等级',
    `vip_expire_at` DATETIME DEFAULT NULL COMMENT 'VIP过期时间',
    `last_active_at` DATETIME DEFAULT NULL COMMENT '最后活跃',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME DEFAULT NULL,
    UNIQUE KEY `uk_uid` (`uid`),
    UNIQUE KEY `uk_phone` (`phone`),
    KEY `idx_status` (`status`),
    KEY `idx_gender` (`gender`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户资料表
CREATE TABLE IF NOT EXISTS `user_profile` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `height` INT DEFAULT NULL COMMENT '身高cm',
    `weight` INT DEFAULT NULL COMMENT '体重kg',
    `job` VARCHAR(100) DEFAULT NULL COMMENT '职业',
    `income` VARCHAR(50) DEFAULT NULL COMMENT '收入',
    `education` VARCHAR(20) DEFAULT NULL COMMENT '学历',
    `school` VARCHAR(100) DEFAULT NULL COMMENT '学校',
    `city` VARCHAR(50) DEFAULT NULL COMMENT '城市',
    `longitude` DECIMAL(10,7) DEFAULT NULL,
    `latitude` DECIMAL(10,7) DEFAULT NULL,
    `marriage` TINYINT DEFAULT 0 COMMENT '婚姻状态',
    `smoking` TINYINT DEFAULT 0 COMMENT '吸烟',
    `drinking` TINYINT DEFAULT 0 COMMENT '饮酒',
    `hometown` VARCHAR(50) DEFAULT NULL COMMENT '家乡',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户认证表
CREATE TABLE IF NOT EXISTS `user_auth` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `real_name_auth` TINYINT DEFAULT 0 COMMENT '实名认证',
    `real_name` VARCHAR(50) DEFAULT NULL COMMENT '真实姓名',
    `education_auth` TINYINT DEFAULT 0 COMMENT '学历认证',
    `education_school` VARCHAR(100) DEFAULT NULL COMMENT '认证学校',
    `job_auth` TINYINT DEFAULT 0 COMMENT '职业认证',
    `asset_auth` TINYINT DEFAULT 0 COMMENT '资产认证',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户照片表
CREATE TABLE IF NOT EXISTS `user_photo` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `position` TINYINT DEFAULT 0 COMMENT '位置',
    `is_avatar` TINYINT DEFAULT 0 COMMENT '是否头像',
    `audit_status` TINYINT DEFAULT 0 COMMENT '审核状态',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 关注表
CREATE TABLE IF NOT EXISTS `follow` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `follower_id` BIGINT UNSIGNED NOT NULL COMMENT '关注者',
    `following_id` BIGINT UNSIGNED NOT NULL COMMENT '被关注者',
    `type` TINYINT DEFAULT 1 COMMENT '类型',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_follow` (`follower_id`, `following_id`),
    KEY `idx_following` (`following_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 兴趣标签表
CREATE TABLE IF NOT EXISTS `interest_tag` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL COMMENT '标签名',
    `category` VARCHAR(20) DEFAULT NULL COMMENT '分类',
    `hot_score` INT DEFAULT 0 COMMENT '热度',
    `status` TINYINT DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户兴趣关联表
CREATE TABLE IF NOT EXISTS `user_interest` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `tag_id` BIGINT UNSIGNED NOT NULL,
    UNIQUE KEY `uk_user_tag` (`user_id`, `tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 验证码表
CREATE TABLE IF NOT EXISTS `sms_code` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `phone` VARCHAR(20) NOT NULL,
    `code` VARCHAR(10) NOT NULL,
    `type` TINYINT DEFAULT 1 COMMENT '类型',
    `used` TINYINT DEFAULT 0,
    `expire_at` DATETIME DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_phone_type` (`phone`, `type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 访客记录表
CREATE TABLE IF NOT EXISTS `visitor` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `visitor_id` BIGINT UNSIGNED NOT NULL COMMENT '访客',
    `host_id` BIGINT UNSIGNED NOT NULL COMMENT '主人',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_visitor` (`visitor_id`, `host_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;