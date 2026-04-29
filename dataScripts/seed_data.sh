#!/bin/bash
# HeartMatch 测试数据生成脚本

echo "=========================================="
echo "HeartMatch 测试数据生成"
echo "=========================================="

# 进入项目目录
cd /home/lisca/dev-ai

# 1. 创建数据库
echo ""
echo ">>> 1. 创建数据库..."
docker exec heartmatch-mysql mysql -uroot -proot -e "
CREATE DATABASE IF NOT EXISTS heartmatch_user CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS heartmatch_content CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
"
echo "✓ 数据库创建完成"

# 2. 创建表
echo ""
echo ">>> 2. 创建数据表..."

# User 数据库表
docker exec heartmatch-mysql mysql -uroot -proot heartmatch_user -e "
CREATE TABLE IF NOT EXISTS \`user\` (
    \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
    \`uid\` VARCHAR(64) UNIQUE,
    \`phone\` VARCHAR(20),
    \`username\` VARCHAR(64) UNIQUE,
    \`password\` VARCHAR(128),
    \`nickname\` VARCHAR(100),
    \`avatar\` VARCHAR(500),
    \`gender\` TINYINT DEFAULT 0,
    \`birthday\` DATE,
    \`bio\` VARCHAR(500),
    \`status\` TINYINT DEFAULT 1,
    \`vip_level\` INT DEFAULT 0,
    \`vip_expire_at\` DATETIME,
    \`last_active_at\` DATETIME,
    \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_profile (
    \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
    \`user_id\` BIGINT,
    \`height\` INT,
    \`weight\` INT,
    \`job\` VARCHAR(100),
    \`income\` VARCHAR(50),
    \`education\` VARCHAR(50),
    \`school\` VARCHAR(200),
    \`city\` VARCHAR(100),
    \`longitude\` DOUBLE,
    \`latitude\` DOUBLE,
    \`marriage\` INT DEFAULT 0,
    \`smoking\` INT DEFAULT 0,
    \`drinking\` INT DEFAULT 0,
    \`hometown\` VARCHAR(100),
    \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
"
echo "✓ heartmatch_user 表创建完成"

# Content 数据库表
docker exec heartmatch-mysql mysql -uroot -proot heartmatch_content -e "
CREATE TABLE IF NOT EXISTS \`post\` (
    \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
    \`user_id\` BIGINT,
    \`content\` VARCHAR(2000),
    \`type\` TINYINT DEFAULT 1,
    \`media_urls\` TEXT,
    \`music_id\` BIGINT,
    \`music_title\` VARCHAR(200),
    \`location\` VARCHAR(200),
    \`topic_id\` BIGINT,
    \`like_count\` INT DEFAULT 0,
    \`comment_count\` INT DEFAULT 0,
    \`share_count\` INT DEFAULT 0,
    \`view_count\` INT DEFAULT 0,
    \`status\` TINYINT DEFAULT 1,
    \`audit_status\` TINYINT DEFAULT 0,
    \`expire_at\` DATETIME,
    \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS \`topic\` (
    \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
    \`name\` VARCHAR(200),
    \`description\` VARCHAR(500),
    \`icon\` VARCHAR(200),
    \`post_count\` INT DEFAULT 0,
    \`heat_score\` DOUBLE DEFAULT 0,
    \`category\` VARCHAR(50),
    \`status\` TINYINT DEFAULT 1,
    \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS \`comment\` (
    \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
    \`post_id\` BIGINT,
    \`user_id\` BIGINT,
    \`parent_id\` BIGINT,
    \`content\` VARCHAR(500),
    \`like_count\` INT DEFAULT 0,
    \`status\` TINYINT DEFAULT 1,
    \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
"
echo "✓ heartmatch_content 表创建完成"

# 3. 清空现有数据
echo ""
echo ">>> 3. 清空现有数据..."
docker exec heartmatch-mysql mysql -uroot -proot heartmatch_content -e "TRUNCATE TABLE comment; TRUNCATE TABLE post; TRUNCATE TABLE topic;"
docker exec heartmatch-mysql mysql -uroot -proot heartmatch_user -e "TRUNCATE TABLE user_profile; TRUNCATE TABLE user;"
echo "✓ 数据已清空"

# 4. 插入话题
echo ""
echo ">>> 4. 插入话题..."
docker exec heartmatch-mysql mysql -uroot -proot heartmatch_content -e "
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
"
echo "✓ 话题插入完成"

# 5. 生成50个用户
echo ""
echo ">>> 5. 生成 50 个用户..."
echo "    (密码全部是 123456)"

# 创建临时SQL文件
cat > /tmp/insert_users.sql << 'SQLFILE'
USE heartmatch_user;

-- 插入50个用户
INSERT INTO `user` (uid, username, password, nickname, avatar, gender, birthday, bio, status, created_at) VALUES
SQLFILE

# 生成50个用户数据
for i in {1..50}; do
    uid=$(printf "u%08d" $i)
    username=$(printf "user%03d" $i)
    # 密码是 123456 的 MD5
    password="e10adc3949ba59abbe56e057f20f883e"

    # 随机昵称
    case $((i % 5)) in
        0) nickname="小甜心$(($RANDOM % 100))";;
        1) nickname="阳光男孩$(($RANDOM % 100))";;
        2) nickname="星星点灯$(($RANDOM % 100))";;
        3) nickname="夜色温柔$(($RANDOM % 100))";;
        4) nickname="追风少年$(($RANDOM % 100))";;
    esac

    # 头像使用 pravatar.cc
    avatar="https://i.pravatar.cc/200?img=$((i % 70 + 1))"
    gender=$((RANDOM % 2 + 1))
    bio="我是${nickname}，很高兴认识大家！"

    # 计算随机生日
    year=$((1990 + RANDOM % 15))
    month=$((1 + RANDOM % 12))
    day=$((1 + RANDOM % 28))
    birthday="${year}-${month}-${day}"

    # 随机创建时间 (1-30天前)
    days_ago=$((RANDOM % 30))
    created_at=$(date -d "$days_ago days ago" '+%Y-%m-%d %H:%M:%S')

    if [ $i -eq 50 ]; then
        echo "('${uid}', '${username}', '${password}', '${nickname}', '${avatar}', ${gender}, '${birthday}', '${bio}', 1, '${created_at}');" >> /tmp/insert_users.sql
    else
        echo "('${uid}', '${username}', '${password}', '${nickname}', '${avatar}', ${gender}, '${birthday}', '${bio}', 1, '${created_at}')," >> /tmp/insert_users.sql
    fi
done

docker exec -i heartmatch-mysql mysql -uroot -proot < /tmp/insert_users.sql
echo "✓ 用户插入完成"

# 6. 生成用户资料
echo ""
echo ">>> 6. 生成用户资料..."

cat > /tmp/insert_profiles.sql << 'SQLFILE'
USE heartmatch_user;

INSERT INTO user_profile (user_id, job, income, education, city, marriage, smoking, drinking, hometown) VALUES
SQLFILE

cities=("北京" "上海" "深圳" "广州" "杭州" "成都" "武汉" "南京" "西安" "苏州")
jobs=("软件工程师" "产品经理" "设计师" "教师" "医生" "律师" "会计" "销售" "市场" "运营")
educations=("高中" "大专" "本科" "硕士" "博士")
incomes=("5K以下" "5K-10K" "10K-20K" "20K-50K" "50K以上")

for i in {1..50}; do
    city=${cities[$((RANDOM % 10))]}
    job=${jobs[$((RANDOM % 10))]}
    education=${educations[$((RANDOM % 5))]}
    income=${incomes[$((RANDOM % 5))]}
    marriage=$((RANDOM % 3))
    smoking=$((RANDOM % 3))
    drinking=$((RANDOM % 3))
    hometown=${cities[$((RANDOM % 10))]}

    if [ $i -eq 50 ]; then
        echo "($i, '$job', '$income', '$education', '$city', $marriage, $smoking, $drinking, '$hometown');" >> /tmp/insert_profiles.sql
    else
        echo "($i, '$job', '$income', '$education', '$city', $marriage, $smoking, $drinking, '$hometown')," >> /tmp/insert_profiles.sql
    fi
done

docker exec -i heartmatch-mysql mysql -uroot -proot < /tmp/insert_profiles.sql
echo "✓ 用户资料插入完成"

# 7. 生成动态 (需要先下载图片)
echo ""
echo ">>> 7. 生成动态..."
echo "    正在下载图片并上传到 imgBB..."

# imgBB API Key
IMGBB_KEY="a7eaf08c4d8ec70671e7ab5c8f4b56fd"

# 创建动态内容数组
contents=(
    "今天天气真好，出来逛街啦~"
    "新买的手表到了，好开心！"
    "加班到深夜，只有咖啡陪伴"
    "周末约了朋友一起吃饭，开心！"
    "今天运动了一小时，感觉很好"
    "分享一波美食，太诱人了"
    "新买的衣服到了，试穿一下"
    "今天看到的天空太美了"
    "周末去爬山，呼吸新鲜空气"
    "咖啡时光，悠闲的下午"
    "学习新技能中，加油！"
    "今天遇到了有趣的事情"
    "新家装修好了，欢迎参观"
    "旅行的意义在于发现美"
    "美食探店，这家店不错"
)

cat > /tmp/insert_posts.sql << 'SQLFILE'
USE heartmatch_content;

INSERT INTO post (user_id, content, type, media_urls, location, topic_id, like_count, comment_count, share_count, view_count, status, audit_status, created_at) VALUES
SQLFILE

total_posts=0

for user_id in {1..50}; do
    # 每个用户1-3条动态
    post_count=$((1 + RANDOM % 3))

    for ((j=0; j<post_count; j++)); do
        total_posts=$((total_posts + 1))

        # 随机内容
        content_idx=$((RANDOM % ${#contents[@]}))
        content="${contents[$content_idx]}"

        # 随机位置
        if [ $((RANDOM % 10)) -gt 3 ]; then
            city=${cities[$((RANDOM % 10))]}
            location="'$city'"
        else
            location="NULL"
        fi

        # 随机话题
        topic_id=$((1 + RANDOM % 10))

        # 随机点赞、评论数
        like_count=$((RANDOM % 100))
        comment_count=$((RANDOM % 20))
        share_count=$((RANDOM % 10))
        view_count=$((like_count * (3 + RANDOM % 5)))

        # 随机时间
        hours_ago=$((RANDOM % 168))
        created_at=$(date -d "$hours_ago hours ago" '+%Y-%m-%d %H:%M:%S')

        # 随机获取1-4张图片
        img_count=$((1 + RANDOM % 4))
        media_urls="["

        for ((k=0; k<img_count; k++)); do
            seed=$((1 + RANDOM % 500))

            # 从 picsum 下载图片
            img_data=$(curl -sL "https://picsum.photos/seed/${seed}/800/800" -o /tmp/post_img.jpg 2>/dev/null && base64 /tmp/post_img.jpg 2>/dev/null)

            if [ -n "$img_data" ]; then
                # 上传到 imgBB
                imgbb_response=$(curl -s -X POST "https://api.imgbb.com/1/upload?key=${IMGBB_KEY}" \
                    -F "image=${img_data}" \
                    -F "name=post_${seed}.jpg" 2>/dev/null)

                img_url=$(echo "$imgbb_response" | grep -o '"url":"[^"]*"' | head -1 | sed 's/"url":"//;s/"$//')

                if [ -n "$img_url" ] && [ "$img_url" != "null" ]; then
                    if [ $k -gt 0 ]; then
                        media_urls="${media_urls},"
                    fi
                    media_urls="${media_urls}\"${img_url}\""
                    echo -n "."
                fi
            fi

            sleep 0.3
        done

        media_urls="${media_urls}]"

        # 如果没有图片，设为空数组
        if [ "$media_urls" = "[]" ] || [ "$media_urls" = "[null]" ]; then
            media_urls="[]"
        fi

        if [ $total_posts -eq 80 ]; then
            echo "($user_id, '$content', 1, '$media_urls', $location, $topic_id, $like_count, $comment_count, $share_count, $view_count, 1, 1, '$created_at');" >> /tmp/insert_posts.sql
        else
            echo "($user_id, '$content', 1, '$media_urls', $location, $topic_id, $like_count, $comment_count, $share_count, $view_count, 1, 1, '$created_at')," >> /tmp/insert_posts.sql
        fi
    done
done

echo ""
echo "    插入动态到数据库..."

docker exec -i heartmatch-mysql mysql -uroot -proot < /tmp/insert_posts.sql
echo ""
echo "✓ 动态插入完成"

# 8. 统计
echo ""
echo "=========================================="
echo "数据生成完成!"
echo "=========================================="
echo ""
echo "统计信息:"
echo "  - 用户数: $(docker exec heartmatch-mysql mysql -uroot -proot heartmatch_user -N -e "SELECT COUNT(*) FROM user;" 2>/dev/null)"
echo "  - 动态数: $(docker exec heartmatch-mysql mysql -uroot -proot heartmatch_content -N -e "SELECT COUNT(*) FROM post;" 2>/dev/null)"
echo "  - 话题数: $(docker exec heartmatch-mysql mysql -uroot -proot heartmatch_content -N -e "SELECT COUNT(*) FROM topic;" 2>/dev/null)"
echo ""
echo "测试账号:"
echo "  用户名: user001 ~ user050"
echo "  密码:   123456"
echo ""
echo "现在可以启动前端测试 Feed 模块了!"
echo ""