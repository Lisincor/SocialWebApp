-- Live Service Database Schema
-- Database: heartmatch_live

CREATE DATABASE IF NOT EXISTS heartmatch_live DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE heartmatch_live;

-- 直播间表
CREATE TABLE IF NOT EXISTS live_room (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '直播间ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    title VARCHAR(100) NOT NULL COMMENT '直播标题',
    cover_url VARCHAR(500) COMMENT '封面URL',
    type TINYINT NOT NULL DEFAULT 1 COMMENT '直播类型: 1-普通直播 2-红娘直播 3-相亲直播',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '状态: 0-未开播 1-直播中 2-已结束',
    viewer_count INT DEFAULT 0 COMMENT '观众数',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    stream_url VARCHAR(500) COMMENT '流地址',
    started_at DATETIME COMMENT '开播时间',
    ended_at DATETIME COMMENT '结束时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记',
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='直播间表';

-- 礼物表
CREATE TABLE IF NOT EXISTS live_gift (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '礼物ID',
    name VARCHAR(50) NOT NULL COMMENT '礼物名称',
    icon VARCHAR(500) NOT NULL COMMENT '礼物图标',
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '价格',
    effect VARCHAR(200) COMMENT '特效描述',
    status TINYINT DEFAULT 1 COMMENT '状态: 1-可用 0-禁用',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记',
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='礼物表';

-- 礼物记录表
CREATE TABLE IF NOT EXISTS live_gift_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
    room_id BIGINT NOT NULL COMMENT '直播间ID',
    sender_id BIGINT NOT NULL COMMENT '送礼用户ID',
    receiver_id BIGINT NOT NULL COMMENT '收礼用户ID',
    gift_id BIGINT NOT NULL COMMENT '礼物ID',
    gift_count INT NOT NULL DEFAULT 1 COMMENT '礼物数量',
    total_price DECIMAL(10, 2) NOT NULL COMMENT '总价值',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '送礼时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记',
    INDEX idx_room_id (room_id),
    INDEX idx_sender_id (sender_id),
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='礼物记录表';

-- 弹幕表
CREATE TABLE IF NOT EXISTS live_barrage (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '弹幕ID',
    room_id BIGINT NOT NULL COMMENT '直播间ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    content VARCHAR(200) NOT NULL COMMENT '弹幕内容',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '发送时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记',
    INDEX idx_room_id (room_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='弹幕表';

-- 插入默认礼物数据
INSERT INTO live_gift (name, icon, price, effect, status) VALUES
('小花', '/static/gifts/flower.png', 1.00, '一朵小花送给主播', 1),
('爱心', '/static/gifts/heart.png', 5.00, '比心~', 1),
('奶茶', '/static/gifts/coffee.png', 10.00, '主播辛苦啦~', 1),
('蛋糕', '/static/gifts/cake.png', 50.00, '甜蜜蛋糕', 1),
('跑车', '/static/gifts/car.png', 100.00, '豪华跑车闪亮登场', 1),
('火箭', '/static/gifts/rocket.png', 500.00, '火箭升空！', 1),
('城堡', '/static/gifts/castle.png', 1000.00, '恭喜主播喜提城堡！', 1),
('游艇', '/static/gifts/yacht.png', 2000.00, '豪华游艇出海啦~', 1);
