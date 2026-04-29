#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HeartMatch 测试数据生成器 - 使用 MySQL 连接器直接插入
"""

import mysql.connector
import json
import random
import time

# 配置
MYSQL_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "root",
    "charset": "utf8mb4",
    "use_unicode": True
}

IMGBB_KEY = "a7eaf08c4d8ec70671e7ab5c8f4b56fd"

def run_cmd(cmd):
    import subprocess
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout.strip()

def download_and_upload(seed):
    """下载图片并上传到 imgBB"""
    import subprocess
    try:
        # 下载图片
        url = f"https://picsum.photos/seed/{seed}/800/800"
        subprocess.run(["curl", "-sL", url, "-o", "/tmp/post_img.jpg"], capture_output=True, timeout=30)

        import os
        if not os.path.exists("/tmp/post_img.jpg"):
            return None

        if os.path.getsize("/tmp/post_img.jpg") < 1000:
            return None

        # 上传到 imgBB
        result = subprocess.run(
            ["curl", "-s", "--connect-timeout", "10", "--max-time", "30",
             "-X", "POST", f"https://api.imgbb.com/1/upload?key={IMGBB_KEY}",
             "-F", "image=@/tmp/post_img.jpg",
             "-F", f"name=post_{seed}.jpg"],
            capture_output=True, text=True, timeout=60
        )

        data = json.loads(result.stdout)
        if data.get("success"):
            return data["data"]["url"]
    except Exception as e:
        print(f"E", end="", flush=True)
    return None

def main():
    print("开始生成测试数据...")
    print()

    # 连接数据库
    conn = mysql.connector.connect(**MYSQL_CONFIG)
    cursor = conn.cursor()

    # 动态内容（中文）
    contents = [
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

    # 昵称（中文）
    nicknames = [
        "小甜心", "阳光男孩", "星星点灯", "夜色温柔", "追风少年",
        "樱花树下", "奶茶控", "猫咪奴", "旅行家", "美食家",
        "摄影达人", "健身爱好者", "书虫", "音乐迷", "电影控",
        "潮人", "小清新", "文艺青年", "宅男", "户外爱好者"
    ]

    cities = ["北京", "上海", "深圳", "广州", "杭州", "成都", "武汉", "南京", "西安", "苏州"]
    jobs = ["软件工程师", "产品经理", "设计师", "教师", "医生", "律师", "会计", "销售", "市场", "运营"]
    educations = ["高中", "大专", "本科", "硕士", "博士"]
    incomes = ["5K以下", "5K-10K", "10K-20K", "20K-50K", "50K以上"]

    print("正在下载图片并上传到 imgBB...")
    print()

    user_ids = []
    total_images = 0

    # 生成 50 个用户
    for i in range(1, 51):
        uid = f"u{i:08d}"
        username = f"user{i:03d}"
        # 密码是 123456 的 MD5 (with salt: heartmatch_salt)
        password = "3d0fed5789ba2d9ccf4cedce7247b09d"
        nickname = f"{random.choice(nicknames)}{random.randint(10, 99)}"
        avatar = f"https://i.pravatar.cc/200?img={(i % 70) + 1}"
        gender = random.choice([1, 2])
        bio = f"我是{nickname}，很高兴认识大家！"

        # 插入用户
        cursor.execute(
            """INSERT INTO heartmatch_user.user (uid, username, password, nickname, avatar, gender, bio, status, created_at)
               VALUES (%s, %s, %s, %s, %s, %s, %s, 1, NOW())""",
            (uid, username, password, nickname, avatar, gender, bio)
        )

        user_id = cursor.lastrowid
        user_ids.append(user_id)

        # 插入用户资料
        cursor.execute(
            """INSERT INTO heartmatch_user.user_profile
               (user_id, job, income, education, city, marriage, smoking, drinking, hometown)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (user_id, random.choice(jobs), random.choice(incomes),
             random.choice(educations), random.choice(cities),
             random.randint(0, 2), random.randint(0, 2),
             random.randint(0, 2), random.choice(cities))
        )

        # 每个用户1-3条动态
        post_count = random.randint(1, 3)

        for j in range(post_count):
            content = random.choice(contents)
            location = random.choice(cities) if random.random() > 0.3 else None
            topic_id = random.randint(1, 10)
            like_count = random.randint(0, 100)
            comment_count = random.randint(0, 20)
            share_count = random.randint(0, 10)
            view_count = like_count * random.randint(3, 8)

            # 获取图片
            img_count = random.randint(1, 3)
            images = []

            for k in range(img_count):
                seed = random.randint(1, 500)
                img_url = download_and_upload(seed)
                if img_url:
                    images.append(img_url)
                    total_images += 1
                    print(".", end="", flush=True)
                time.sleep(0.3)

            media_urls = json.dumps(images) if images else "[]"

            # 插入动态
            cursor.execute(
                """INSERT INTO heartmatch_content.post
                   (user_id, content, type, media_urls, location, topic_id,
                    like_count, comment_count, share_count, view_count, status, audit_status, created_at)
                   VALUES (%s, %s, 1, %s, %s, %s, %s, %s, %s, %s, 1, 1, DATE_SUB(NOW(), INTERVAL %s HOUR))""",
                (user_id, content, media_urls, location, topic_id,
                 like_count, comment_count, share_count, view_count, random.randint(1, 168))
            )

        if i % 10 == 0:
            conn.commit()
            print(f" [{i}/50]", end="", flush=True)

    conn.commit()

    # 统计
    cursor.execute("SELECT COUNT(*) FROM heartmatch_user.user")
    user_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM heartmatch_content.post")
    post_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM heartmatch_content.topic")
    topic_count = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    print()
    print("=" * 50)
    print("数据生成完成!")
    print("=" * 50)
    print()
    print(f"统计信息:")
    print(f"  - 用户数: {user_count}")
    print(f"  - 动态数: {post_count}")
    print(f"  - 话题数: {topic_count}")
    print(f"  - 图片数: {total_images}")
    print()
    print("测试账号:")
    print("  用户名: user001 ~ user050")
    print("  密码:   123456")
    print()

if __name__ == "__main__":
    main()