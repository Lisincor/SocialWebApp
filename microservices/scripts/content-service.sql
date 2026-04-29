-- 内容服务数据库
CREATE DATABASE IF NOT EXISTS heartmatch_content DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE heartmatch_content;

-- 动态表
CREATE TABLE IF NOT EXISTS `post` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '发布者',
    `content` TEXT COMMENT '正文',
    `type` TINYINT DEFAULT 1 COMMENT '类型 1图文 2视频 3故事',
    `media_urls` JSON COMMENT '媒体URLs',
    `music_id` BIGINT DEFAULT NULL COMMENT '音乐ID',
    `music_title` VARCHAR(100) DEFAULT NULL COMMENT '音乐标题',
    `location` VARCHAR(100) DEFAULT NULL COMMENT '位置',
    `topic_id` BIGINT DEFAULT NULL COMMENT '话题ID',
    `like_count` INT DEFAULT 0,
    `comment_count` INT DEFAULT 0,
    `share_count` INT DEFAULT 0,
    `view_count` INT DEFAULT 0,
    `status` TINYINT DEFAULT 1 COMMENT '状态',
    `audit_status` TINYINT DEFAULT 0 COMMENT '审核状态',
    `expire_at` DATETIME DEFAULT NULL COMMENT '故事过期时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_user_created` (`user_id`, `created_at`),
    KEY `idx_type_created` (`type`, `created_at`),
    KEY `idx_topic_id` (`topic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 评论表
CREATE TABLE IF NOT EXISTS `comment` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `post_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `parent_id` BIGINT DEFAULT NULL COMMENT '父评论',
    `content` TEXT COMMENT '内容',
    `like_count` INT DEFAULT 0,
    `reply_count` INT DEFAULT 0,
    `status` TINYINT DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_post_created` (`post_id`, `created_at`),
    KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 话题表
CREATE TABLE IF NOT EXISTS `topic` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL COMMENT '话题名',
    `description` VARCHAR(200) DEFAULT NULL,
    `icon` VARCHAR(500) DEFAULT NULL,
    `post_count` INT DEFAULT 0,
    `follow_count` INT DEFAULT 0,
    `hot_score` INT DEFAULT 0,
    `status` TINYINT DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_hot_score` (`hot_score`),
    UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 故事表
CREATE TABLE IF NOT EXISTS `story` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `media_url` VARCHAR(500) NOT NULL,
    `thumbnail_url` VARCHAR(500) DEFAULT NULL,
    `duration` INT DEFAULT 15 COMMENT '时长(秒)',
    `view_count` INT DEFAULT 0,
    `expire_at` DATETIME NOT NULL COMMENT '过期时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_user_expire` (`user_id`, `expire_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 点赞记录表
CREATE TABLE IF NOT EXISTS `like_record` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `target_type` VARCHAR(20) NOT NULL COMMENT 'post/comment',
    `target_id` BIGINT UNSIGNED NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_like` (`user_id`, `target_type`, `target_id`),
    KEY `idx_target` (`target_type`, `target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 收藏表
CREATE TABLE IF NOT EXISTS `favorite` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `post_id` BIGINT UNSIGNED NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_favorite` (`user_id`, `post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 音乐表
CREATE TABLE IF NOT EXISTS `music` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(100) NOT NULL,
    `artist` VARCHAR(100) DEFAULT NULL,
    `url` VARCHAR(500) NOT NULL,
    `duration` INT DEFAULT 0,
    `use_count` INT DEFAULT 0,
    `status` TINYINT DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_use_count` (`use_count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;