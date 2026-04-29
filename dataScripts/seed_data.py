#!/usr/bin/env python3
"""
HeartMatch 测试数据生成器
生成50个用户和相应的动态，用于测试Feed模块
"""

import requests
import random
import time
import json
import mysql.connector
from datetime import datetime, timedelta

# ============== 配置 ==============
IMGBB_API_KEY = "a7eaf08c4d8ec70671e7ab5c8f4b56fd"
IMGBB_URL = "https://api.imgbb.com/1/upload"

MYSQL_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "root",
    "database": None  # 先连接不含数据库，创建后再切换
}

# ============== 数据源 ==============

# 随机头像 (从 picsum.photos 获取)
AVATAR_URLS = [
    f"https://picsum.photos/seed/{i}/200/200" for i in range(1, 101)
]

# 中国城市
CITIES = [
    "北京", "上海", "深圳", "广州", "杭州", "成都", "武汉", "南京",
    "西安", "苏州", "重庆", "天津", "青岛", "长沙", "郑州", "东莞",
    "佛山", "沈阳", "大连", "济南"
]

# 动态内容模板
CONTENT_TEMPLATES = [
    "今天天气真好，出来逛街啦~",
    "新买的手表到了，好开心！",
    "加班到深夜，只有咖啡陪伴",
    "周末约了朋友一起吃饭，开心！",
    "今天运动了一小时，感觉很好",
    "分享一波美食，太诱人了",
    "新买的衣服到了，试穿一下",
    "今天看到的天空太美了",
    "周末去爬山，呼吸新鲜空气",
    "咖啡时光，悠闲的下午",
    "学习新技能中，加油！",
    "今天遇到了有趣的事情",
    "新家装修好了，欢迎参观",
    "旅行的意义在于发现美",
    "美食探店，这家店不错",
    "运动打卡，坚持就是胜利",
    "今天完成了重要的项目",
    "养宠物的人一定很有爱心",
    "音乐让生活更美好",
    "每天进步一点点"
]

# 中国风昵称
NICKNAMES = [
    "小甜心", "阳光男孩", "星星点灯", "夜色温柔", "追风少年",
    "樱花树下", "奶茶控", "猫咪奴", "旅行家", "美食家",
    "摄影达人", "健身爱好者", "书虫", "音乐迷", "电影控",
    "潮人", "小清新", "文艺青年", "宅男", "户外爱好者",
    "咖啡师", "设计师", "程序员", "医生", "老师",
    "律师", "会计", "销售", "市场", "运营",
    "产品经理", "HR", "行政", "客服", "司机",
    "厨师", "画家", "作家", "歌手", "舞者",
    "模特", "网红", "主播", "博主", "UP主",
    "吃货", "美妆达人", "穿搭博主", "旅游博主", "数码博主",
    "汽车达人", "房产达人", "理财达人", "情感博主", "职场博主"
]

JOBS = [
    "软件工程师", "产品经理", "设计师", "教师", "医生",
    "律师", "会计", "销售", "市场", "运营",
    "HR", "行政", "客服", "司机", "厨师",
    "自由职业", "创业者", "学生", "退休"
]

EDUCATIONS = ["高中", "大专", "本科", "硕士", "博士"]

INCOMES = ["5K以下", "5K-10K", "10K-20K", "20K-50K", "50K以上"]

# 话题
TOPICS = [
    (1, "#今日穿搭"),
    (2, "#周末美食"),
    (3, "#健身打卡"),
    (4, "#旅行日记"),
    (5, "#摄影分享"),
    (6, "#音乐时光"),
    (7, "#读书分享"),
    (8, "#电影推荐"),
]

def download_image(url):
    """从URL下载图片"""
    try:
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            return response.content
    except Exception as e:
        print(f"下载图片失败: {e}")
    return None

def upload_to_imgbb(image_bytes, filename="image.jpg"):
    """上传图片到 imgBB"""
    try:
        files = {'image': (filename, image_bytes, 'image/jpeg')}
        data = {'key': IMGBB_API_KEY}
        response = requests.post(IMGBB_URL, data=data, files=files, timeout=60)
        result = response.json()

        if result.get('success'):
            return result['data']['url']
        else:
            print(f"上传失败: {result}")
    except Exception as e:
        print(f"上传到 imgBB 失败: {e}")
    return None

def get_random_post_images():
    """获取多张随机图片用于动态"""
    images = []
    # 随机获取1-4张图片
    count = random.randint(1, 4)
    seen = set()
    while len(images) < count:
        # 从 picsum 使用随机种子
        seed = random.randint(1, 500)
        if seed not in seen:
            seen.add(seed)
            url = f"https://picsum.photos/seed/{seed}/800/800"
            print(f"  下载图片: {url}")
            img_bytes = download_image(url)
            if img_bytes:
                # 上传到 imgBB
                img_url = upload_to_imgbb(img_bytes, f"post_{seed}.jpg")
                if img_url:
                    images.append(img_url)
                    print(f"  上传成功: {img_url[:50]}...")
                    time.sleep(0.5)  # 避免请求过快
    return images

def connect_mysql(database=None):
    """连接MySQL"""
    config = MYSQL_CONFIG.copy()
    if database:
        config['database'] = database
    return mysql.connector.connect(**config)

def init_databases():
    """初始化数据库"""
    print("\n=== 初始化数据库 ===")

    # 连接 MySQL (不指定数据库)
    conn = connect_mysql()
    cursor = conn.cursor()

    # 创建 heartmatch_user 数据库
    print("创建 heartmatch_user 数据库...")
    cursor.execute("CREATE DATABASE IF NOT EXISTS heartmatch_user CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    cursor.execute("USE heartmatch_user")

    # 创建 user 表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            uid VARCHAR(64) UNIQUE,
            phone VARCHAR(20),
            username VARCHAR(64) UNIQUE,
            password VARCHAR(128),
            nickname VARCHAR(100),
            avatar VARCHAR(500),
            gender TINYINT DEFAULT 0,
            birthday DATE,
            bio VARCHAR(500),
            status TINYINT DEFAULT 1,
            vip_level INT DEFAULT 0,
            vip_expire_at DATETIME,
            last_active_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    """)

    # 创建 user_profile 表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_profile (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT,
            height INT,
            weight INT,
            job VARCHAR(100),
            income VARCHAR(50),
            education VARCHAR(50),
            school VARCHAR(200),
            city VARCHAR(100),
            longitude DOUBLE,
            latitude DOUBLE,
            marriage INT DEFAULT 0,
            smoking INT DEFAULT 0,
            drinking INT DEFAULT 0,
            hometown VARCHAR(100),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    """)

    # 创建 heartmatch_content 数据库
    print("创建 heartmatch_content 数据库...")
    cursor.execute("CREATE DATABASE IF NOT EXISTS heartmatch_content CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    cursor.execute("USE heartmatch_content")

    # 创建 post 表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS post (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT,
            content VARCHAR(2000),
            type TINYINT DEFAULT 1,
            media_urls TEXT,
            music_id BIGINT,
            music_title VARCHAR(200),
            location VARCHAR(200),
            topic_id BIGINT,
            like_count INT DEFAULT 0,
            comment_count INT DEFAULT 0,
            share_count INT DEFAULT 0,
            view_count INT DEFAULT 0,
            status TINYINT DEFAULT 1,
            audit_status TINYINT DEFAULT 0,
            expire_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    """)

    # 创建 topic 表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS topic (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(200),
            description VARCHAR(500),
            icon VARCHAR(200),
            post_count INT DEFAULT 0,
            heat_score DOUBLE DEFAULT 0,
            category VARCHAR(50),
            status TINYINT DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    """)

    # 创建 comment 表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS comment (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            post_id BIGINT,
            user_id BIGINT,
            parent_id BIGINT,
            content VARCHAR(500),
            like_count INT DEFAULT 0,
            status TINYINT DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    cursor.close()
    conn.close()
    print("数据库初始化完成！\n")

def create_topics(conn):
    """创建话题"""
    print("=== 创建话题 ===")
    cursor = conn.cursor()

    # 先检查是否已有话题
    cursor.execute("SELECT COUNT(*) FROM topic")
    count = cursor.fetchone()[0]
    if count > 0:
        print(f"话题已存在 ({count} 条)，跳过")
        cursor.close()
        return

    topics_data = [
        ("#今日穿搭", "分享今日穿搭", "👗", "fashion"),
        ("#周末美食", "周末吃什么", "🍜", "food"),
        ("#健身打卡", "坚持锻炼每一天", "💪", "sports"),
        ("#旅行日记", "记录旅途中的风景", "✈️", "travel"),
        ("#摄影分享", "发现生活中的美", "📷", "lifestyle"),
        ("#音乐时光", "分享喜欢的音乐", "🎵", "entertainment"),
        ("#读书分享", "推荐好书", "📚", "culture"),
        ("#电影推荐", "好看的电影", "🎬", "entertainment"),
        ("#宠物萌照", "可爱的小动物", "🐱", "lifestyle"),
        ("#咖啡探店", "发现好喝的咖啡", "☕", "food"),
    ]

    for name, desc, icon, category in topics_data:
        cursor.execute("""
            INSERT INTO topic (name, description, icon, post_count, heat_score, category)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (name, desc, icon, random.randint(100, 10000), random.uniform(100, 1000), category))

    conn.commit()
    cursor.close()
    print(f"已创建 {len(topics_data)} 个话题\n")

def generate_test_data():
    """生成测试数据"""
    print("\n=== 开始生成测试数据 ===")

    # 连接 user 数据库
    user_conn = connect_mysql("heartmatch_user")
    user_cursor = user_conn.cursor()

    # 连接 content 数据库
    content_conn = connect_mysql("heartmatch_content")
    content_cursor = content_conn.cursor()

    users = []
    posts = []

    # 生成50个用户
    print(f"\n生成 50 个用户...")

    for i in range(50):
        uid = f"u{random.randint(10000000, 99999999)}"
        username = f"user{i+1:03d}"
        password = "e10adc3949ba59abbe56e057f20f883e"  # MD5 of "123456"
        nickname = random.choice(NICKNAMES) + str(random.randint(10, 99))
        avatar_seed = random.randint(1, 100)
        avatar = f"https://picsum.photos/seed/avatar{avatar_seed}/200/200"
        gender = random.choice([1, 2])
        birthday = datetime(1990, 1, 1) + timedelta(days=random.randint(0, 5000))
        bio = f"我是{nickname}，很高兴认识大家！"
        status = 1
        created_at = datetime.now() - timedelta(days=random.randint(1, 30))

        # 下载并上传头像
        print(f"  处理用户 {i+1}/50: {nickname}")
        img_bytes = download_image(avatar)
        avatar_url = upload_to_imgbb(img_bytes, f"avatar_{i}.jpg") if img_bytes else avatar

        user_cursor.execute("""
            INSERT INTO user (uid, username, password, nickname, avatar, gender, birthday, bio, status, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (uid, username, password, nickname, avatar_url, gender, birthday, bio, status, created_at))

        user_id = user_cursor.lastrowid

        # 创建用户资料
        profile_cursor = user_conn.cursor()
        profile_cursor.execute("""
            INSERT INTO user_profile (user_id, job, income, education, city, marriage, smoking, drinking, hometown)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            user_id,
            random.choice(JOBS),
            random.choice(INCOMES),
            random.choice(EDUCATIONS),
            random.choice(CITIES),
            random.choice([0, 1, 2]),
            random.choice([0, 1, 2]),
            random.choice([0, 1, 2]),
            random.choice(CITIES)
        ))
        profile_cursor.close()

        users.append({
            "id": user_id,
            "nickname": nickname,
            "avatar": avatar_url
        })

        # 每个用户至少发布1条动态
        post_count = random.randint(1, 3)
        for j in range(post_count):
            content = random.choice(CONTENT_TEMPLATES)
            location = random.choice(CITIES) if random.random() > 0.3 else None
            topic = random.choice(TOPICS)
            post_created_at = created_at - timedelta(hours=random.randint(1, 24))

            # 获取图片
            print(f"    下载动态图片...")
            images = get_random_post_images()
            media_urls = json.dumps(images) if images else None

            # 随机点赞、评论数
            like_count = random.randint(0, 100)
            comment_count = random.randint(0, 20)
            share_count = random.randint(0, 10)
            view_count = random.randint(like_count * 5, like_count * 20)

            content_cursor.execute("""
                INSERT INTO post (user_id, content, type, media_urls, location, topic_id, like_count, comment_count, share_count, view_count, status, audit_status, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (user_id, content, 1, media_urls, location, topic[0], like_count, comment_count, share_count, view_count, 1, 1, post_created_at))

            post_id = content_cursor.lastrowid
            posts.append({
                "id": post_id,
                "user_id": user_id,
                "like_count": like_count,
                "comment_count": comment_count
            })

            # 随机添加评论
            if comment_count > 0:
                for _ in range(random.randint(1, min(comment_count, 5))):
                    commenter = random.choice(users)
                    if commenter['id'] != user_id:
                        comment_content = random.choice([
                            "写得真好！",
                            "支持一下~",
                            "哈哈哈太有趣了",
                            "不错不错",
                            "我也想去！",
                            "赞赞赞！",
                            "好羡慕啊",
                            "哈哈",
                            "👍",
                            "好棒！"
                        ])
                        content_cursor.execute("""
                            INSERT INTO comment (post_id, user_id, content, like_count, status, created_at)
                            VALUES (%s, %s, %s, %s, %s, %s)
                        """, (post_id, commenter['id'], comment_content, random.randint(0, 10), 1, post_created_at + timedelta(minutes=random.randint(1, 60))))

            time.sleep(0.2)

        user_conn.commit()

    content_conn.commit()

    user_cursor.close()
    user_conn.close()
    content_cursor.close()
    content_conn.close()

    print("\n=== 数据生成完成 ===")
    print(f"用户数: {len(users)}")
    print(f"动态数: {len(posts)}")

    # 统计
    conn = connect_mysql("heartmatch_content")
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM post")
    post_total = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM comment")
    comment_total = cursor.fetchone()[0]
    cursor.close()
    conn.close()

    print(f"数据库统计:")
    print(f"  - 动态总数: {post_total}")
    print(f"  - 评论总数: {comment_total}")

if __name__ == "__main__":
    print("=" * 50)
    print("HeartMatch 测试数据生成器")
    print("=" * 50)

    # 初始化数据库
    init_databases()

    # 连接 content 数据库创建话题
    content_conn = connect_mysql("heartmatch_content")
    create_topics(content_conn)
    content_conn.close()

    # 生成测试数据
    generate_test_data()

    print("\n✅ 测试数据生成完成！")
    print("现在可以测试 Feed 模块了。")