-- 匹配服务数据库
CREATE DATABASE IF NOT EXISTS heartmatch_match DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE heartmatch_match;

-- 滑动记录表
CREATE TABLE IF NOT EXISTS `swipe_record` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    `target_user_id` BIGINT UNSIGNED NOT NULL COMMENT '目标用户ID',
    `action` TINYINT NOT NULL COMMENT '操作：1喜欢 2不喜欢 3超级喜欢 4不喜欢',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_user_target` (`user_id`, `target_user_id`),
    KEY `idx_target` (`target_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 匹配记录表
CREATE TABLE IF NOT EXISTS `match_record` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `matched_user_id` BIGINT UNSIGNED NOT NULL,
    `match_type` TINYINT DEFAULT 1 COMMENT '匹配类型',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_users` (`user_id`, `matched_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 用户偏好设置表
CREATE TABLE IF NOT EXISTS `user_preference` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `min_age` INT DEFAULT 18,
    `max_age` INT DEFAULT 50,
    `gender` TINYINT DEFAULT 0 COMMENT '想找的性别',
    `max_distance` INT DEFAULT 50 COMMENT '最大距离km',
    `purpose` VARCHAR(50) DEFAULT NULL COMMENT '目的',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
