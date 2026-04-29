-- Match Service Database Schema
-- Database: heartmatch_match

CREATE DATABASE IF NOT EXISTS heartmatch_match DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE heartmatch_match;

-- 滑动记录表
CREATE TABLE IF NOT EXISTS swipe (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    swiper_id BIGINT NOT NULL COMMENT '滑动者ID',
    swiped_id BIGINT NOT NULL COMMENT '被滑动者ID',
    action TINYINT NOT NULL COMMENT '动作: 1喜欢 2跳过 3超级喜欢',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_swiper_id (swiper_id),
    INDEX idx_swiped_id (swiped_id),
    INDEX idx_swiper_swiped (swiper_id, swiped_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='滑动记录表';

-- 匹配记录表
CREATE TABLE IF NOT EXISTS match_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_a_id BIGINT NOT NULL COMMENT '用户A ID',
    user_b_id BIGINT NOT NULL COMMENT '用户B ID',
    match_type TINYINT NOT NULL DEFAULT 1 COMMENT '匹配类型: 1普通喜欢 2超级喜欢 3今日缘分',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_a_id (user_a_id),
    INDEX idx_user_b_id (user_b_id),
    INDEX idx_users (user_a_id, user_b_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='匹配记录表';
