-- IM Service Database Schema
-- Database: heartmatch_im

CREATE DATABASE IF NOT EXISTS heartmatch_im DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE heartmatch_im;

-- 会话表
CREATE TABLE IF NOT EXISTS `conversation` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '会话ID',
    `uid` VARCHAR(32) NOT NULL COMMENT '会话UID',
    `type` TINYINT NOT NULL DEFAULT 1 COMMENT '1单聊 2群聊',
    `name` VARCHAR(100) DEFAULT NULL COMMENT '群聊名称',
    `avatar` VARCHAR(500) DEFAULT NULL COMMENT '群聊头像',
    `last_message_id` BIGINT DEFAULT NULL COMMENT '最后一条消息ID',
    `last_message_at` DATETIME DEFAULT NULL COMMENT '最后消息时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_uid` (`uid`),
    KEY `idx_type` (`type`),
    KEY `idx_last_message_at` (`last_message_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话表';

-- 会话成员表
CREATE TABLE IF NOT EXISTS `conversation_member` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '成员ID',
    `conversation_id` BIGINT NOT NULL COMMENT '会话ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `role` TINYINT NOT NULL DEFAULT 1 COMMENT '1普通成员 2管理员 3群主',
    `last_read_at` DATETIME DEFAULT NULL COMMENT '最后阅读时间',
    `is_muted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否静音',
    `is_pinned` TINYINT NOT NULL DEFAULT 0 COMMENT '是否置顶',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_conversation_user` (`conversation_id`, `user_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_conversation_id` (`conversation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话成员表';

-- 消息表
CREATE TABLE IF NOT EXISTS `message` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '消息ID',
    `uid` VARCHAR(32) NOT NULL COMMENT '消息UID',
    `conversation_id` BIGINT NOT NULL COMMENT '会话ID',
    `sender_id` BIGINT NOT NULL COMMENT '发送者ID',
    `type` TINYINT NOT NULL DEFAULT 1 COMMENT '1文字 2图片 3语音 4视频',
    `content` TEXT DEFAULT NULL COMMENT '消息内容',
    `media_url` VARCHAR(500) DEFAULT NULL COMMENT '媒体URL',
    `duration` INT DEFAULT NULL COMMENT '音视频时长(秒)',
    `burn_after_read` TINYINT NOT NULL DEFAULT 0 COMMENT '阅后即焚',
    `is_recalled` TINYINT NOT NULL DEFAULT 0 COMMENT '是否已撤回',
    `read_at` DATETIME DEFAULT NULL COMMENT '已读时间',
    `burned_at` DATETIME DEFAULT NULL COMMENT '焚毁时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_uid` (`uid`),
    KEY `idx_conversation_id` (`conversation_id`),
    KEY `idx_sender_id` (`sender_id`),
    KEY `idx_created_at` (`created_at`),
    KEY `idx_conversation_created` (`conversation_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='消息表';
