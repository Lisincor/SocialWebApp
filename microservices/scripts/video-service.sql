-- 视频服务数据库
CREATE DATABASE IF NOT EXISTS heartmatch_video DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE heartmatch_video;

-- 视频表
CREATE TABLE IF NOT EXISTS `video` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `title` VARCHAR(200) DEFAULT NULL,
    `cover_url` VARCHAR(500) DEFAULT NULL,
    `video_url` VARCHAR(500) NOT NULL,
    `duration` INT DEFAULT 0,
    `like_count` INT DEFAULT 0,
    `comment_count` INT DEFAULT 0,
    `share_count` INT DEFAULT 0,
    `status` TINYINT DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 视频评论表
CREATE TABLE IF NOT EXISTS `video_comment` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `video_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `content` TEXT NOT NULL,
    `parent_id` BIGINT UNSIGNED DEFAULT NULL,
    `like_count` INT DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_video` (`video_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
