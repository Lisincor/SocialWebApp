-- HeartMatch 测试数据生成脚本
-- 使用方法: docker exec -i heartmatch-mysql mysql -uroot -proot < seed_data.sql

-- 创建数据库
CREATE DATABASE IF NOT EXISTS heartmatch_user CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS heartmatch_content CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用 heartmatch_user 数据库
USE heartmatch_user;

-- 创建 user 表
CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `uid` VARCHAR(64) UNIQUE,
    `phone` VARCHAR(20),
    `username` VARCHAR(64) UNIQUE,
    `password` VARCHAR(128),
    `nickname` VARCHAR(100),
    `avatar` VARCHAR(500),
    `gender` TINYINT DEFAULT 0,
    `birthday` DATE,
    `bio` VARCHAR(500),
    `status` TINYINT DEFAULT 1,
    `vip_level` INT DEFAULT 0,
    `vip_expire_at` DATETIME,
    `last_active_at` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建 user_profile 表
CREATE TABLE IF NOT EXISTS user_profile (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT,
    `height` INT,
    `weight` INT,
    `job` VARCHAR(100),
    `income` VARCHAR(50),
    `education` VARCHAR(50),
    `school` VARCHAR(200),
    `city` VARCHAR(100),
    `longitude` DOUBLE,
    `latitude` DOUBLE,
    `marriage` INT DEFAULT 0,
    `smoking` INT DEFAULT 0,
    `drinking` INT DEFAULT 0,
    `hometown` VARCHAR(100),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 清空现有数据
TRUNCATE TABLE user_profile;
TRUNCATE TABLE user;

-- 使用 heartmatch_content 数据库
USE heartmatch_content;

-- 创建 post 表
CREATE TABLE IF NOT EXISTS `post` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT,
    `content` VARCHAR(2000),
    `type` TINYINT DEFAULT 1,
    `media_urls` TEXT,
    `music_id` BIGINT,
    `music_title` VARCHAR(200),
    `location` VARCHAR(200),
    `topic_id` BIGINT,
    `like_count` INT DEFAULT 0,
    `comment_count` INT DEFAULT 0,
    `share_count` INT DEFAULT 0,
    `view_count` INT DEFAULT 0,
    `status` TINYINT DEFAULT 1,
    `audit_status` TINYINT DEFAULT 0,
    `expire_at` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建 topic 表
CREATE TABLE IF NOT EXISTS `topic` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(200),
    `description` VARCHAR(500),
    `icon` VARCHAR(200),
    `post_count` INT DEFAULT 0,
    `heat_score` DOUBLE DEFAULT 0,
    `category` VARCHAR(50),
    `status` TINYINT DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建 comment 表
CREATE TABLE IF NOT EXISTS `comment` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `post_id` BIGINT,
    `user_id` BIGINT,
    `parent_id` BIGINT,
    `content` VARCHAR(500),
    `like_count` INT DEFAULT 0,
    `status` TINYINT DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 清空现有数据
TRUNCATE TABLE comment;
TRUNCATE TABLE post;
TRUNCATE TABLE topic;

-- 插入话题数据
INSERT INTO topic (id, name, description, icon, post_count, heat_score, category) VALUES
(1, '#今日穿搭', '分享今日穿搭', '👗', 1250, 850.5, 'fashion'),
(2, '#周末美食', '周末吃什么', '🍜', 2100, 920.3, 'food'),
(3, '#健身打卡', '坚持锻炼每一天', '💪', 890, 650.2, 'sports'),
(4, '#旅行日记', '记录旅途中的风景', '✈️', 1560, 780.8, 'travel'),
(5, '#摄影分享', '发现生活中的美', '📷', 3200, 980.1, 'lifestyle'),
(6, '#音乐时光', '分享喜欢的音乐', '🎵', 780, 420.5, 'entertainment'),
(7, '#读书分享', '推荐好书', '📚', 450, 280.3, 'culture'),
(8, '#电影推荐', '好看的电影', '🎬', 980, 560.7, 'entertainment'),
(9, '#宠物萌照', '可爱的小动物', '🐱', 1680, 750.2, 'lifestyle'),
(10, '#咖啡探店', '发现好喝的咖啡', '☕', 1100, 520.9, 'food');

-- 切换回用户数据库
USE heartmatch_user;

-- 设置结束符为 $$
DELIMITER $$

-- 创建生成测试数据的存储过程
CREATE PROCEDURE generate_test_data()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE j INT DEFAULT 1;
    DECLARE user_count INT DEFAULT 50;
    DECLARE post_per_user INT;
    DECLARE user_id BIGINT;
    DECLARE post_id BIGINT;

    -- 昵称数组
    DECLARE n1 VARCHAR(20);
    DECLARE n2 VARCHAR(20);
    DECLARE city VARCHAR(20);
    DECLARE job VARCHAR(50);
    DECLARE education VARCHAR(20);
    DECLARE income VARCHAR(20);
    DECLARE content VARCHAR(200);
    DECLARE location VARCHAR(50);
    DECLARE avatar_url VARCHAR(200);

    -- 循环生成50个用户
    WHILE i <= user_count DO
        -- 生成随机数据
        SET n1 = ELT(1 + FLOOR(RAND() * 15), '小甜心', '阳光', '星星', '夜色', '追风', '樱花', '奶茶', '猫咪', '旅行', '美食', '摄影', '健身', '书虫', '音乐');
        SET n2 = ELT(1 + FLOOR(RAND() * 10), '男孩', '女孩', '小姐', '先生', '控', '奴', '家', '达人', '青年', '控');
        SET city = ELT(1 + FLOOR(RAND() * 10), '北京', '上海', '深圳', '广州', '杭州', '成都', '武汉', '南京', '西安', '苏州');
        SET job = ELT(1 + FLOOR(RAND() * 10), '软件工程师', '产品经理', '设计师', '教师', '医生', '律师', '会计', '销售', '市场', '运营');
        SET education = ELT(1 + FLOOR(RAND() * 5), '高中', '大专', '本科', '硕士', '博士');
        SET income = ELT(1 + FLOOR(RAND() * 5), '5K以下', '5K-10K', '10K-20K', '20K-50K', '50K以上');

        -- 生成用户
        INSERT INTO user (uid, username, password, nickname, avatar, gender, birthday, bio, status, created_at)
        VALUES (
            CONCAT('u', LPAD(i, 8, '0')),
            CONCAT('user', LPAD(i, 3, '0')),
            'e10adc3949ba59abbe56e057f20f883e',  -- MD5 of "123456"
            CONCAT(n1, n2),
            CONCAT('https://i.pravatar.cc/200?img=', (i % 70) + 1),
            IF(RAND() > 0.5, 1, 2),
            DATE_SUB(CURDATE(), INTERVAL (20 + FLOOR(RAND() * 20)) YEAR),
            CONCAT('我是', n1, n2, '，很高兴认识大家！'),
            1,
            DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY)
        );

        SET user_id = LAST_INSERT_ID();

        -- 生成用户资料
        INSERT INTO user_profile (user_id, job, income, education, city, marriage, smoking, drinking, hometown)
        VALUES (user_id, job, income, education, city, FLOOR(RAND() * 3), FLOOR(RAND() * 3), FLOOR(RAND() * 3), city);

        -- 每个用户生成1-3条动态
        SET post_per_user = 1 + FLOOR(RAND() * 3);
        SET j = 1;
        WHILE j <= post_per_user DO
            SET content = ELT(1 + FLOOR(RAND() * 15),
                '今天天气真好，出来逛街啦~',
                '新买的手表到了，好开心！',
                '加班到深夜，只有咖啡陪伴',
                '周末约了朋友一起吃饭，开心！',
                '今天运动了一小时，感觉很好',
                '分享一波美食，太诱人了',
                '新买的衣服到了，试穿一下',
                '今天看到的天空太美了',
                '周末去爬山，呼吸新鲜空气',
                '咖啡时光，悠闲的下午',
                '学习新技能中，加油！',
                '今天遇到了有趣的事情',
                '新家装修好了，欢迎参观',
                '旅行的意义在于发现美',
                '美食探店，这家店不错'
            );
            SET location = IF(RAND() > 0.3, city, NULL);

            -- 切换到 content 数据库插入动态
            INSERT INTO heartmatch_content.post (user_id, content, type, location, topic_id, like_count, comment_count, share_count, view_count, status, audit_status, created_at)
            VALUES (
                user_id,
                content,
                1,
                location,
                1 + FLOOR(RAND() * 10),
                FLOOR(RAND() * 100),
                FLOOR(RAND() * 20),
                FLOOR(RAND() * 10),
                FLOOR(RAND() * 500),
                1,
                1,
                DATE_SUB(NOW(), INTERVAL (FLOOR(RAND() * 7) * 24 + FLOOR(RAND() * 24)) HOUR)
            );

            SET j = j + 1;
        END WHILE;

        SET i = i + 1;
    END WHILE;
END$$

-- 恢复结束符
DELIMITER ;

-- 执行存储过程
CALL generate_test_data();

-- 删除存储过程
DROP PROCEDURE IF EXISTS generate_test_data;

-- 验证数据
SELECT '用户表数据统计:' as '';
SELECT COUNT(*) as user_count FROM heartmatch_user.user;

SELECT '动态表数据统计:' as '';
SELECT COUNT(*) as post_count FROM heartmatch_content.post;