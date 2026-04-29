#!/usr/bin/env python3
"""
HeartMatch 测试数据生成器 - 生成动态和图片
"""

import subprocess
import json
import random
import time
import os

IMGBB_KEY = "a7eaf08c4d8ec70671e7ab5c8f4b56fd"

def run_cmd(cmd):
    """运行命令并返回输出"""
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout.strip()

def download_and_upload(seed):
    """下载图片并上传到 imgBB"""
    try:
        # 下载图片
        url = f"https://picsum.photos/seed/{seed}/800/800"
        subprocess.run(
            ["curl", "-sL", url, "-o", "/tmp/post_img.jpg"],
            capture_output=True, timeout=30
        )

        # 检查文件是否存在
        if not os.path.exists("/tmp/post_img.jpg"):
            return None

        file_size = os.path.getsize("/tmp/post_img.jpg")
        if file_size < 1000:
            return None

        # 使用文件上传到 imgBB
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
    print("开始生成动态数据...")
    print("正在下载图片并上传到 imgBB (这可能需要几分钟)")
    print()

    # 清空现有动态
    run_cmd('docker exec heartmatch-mysql mysql -uroot -proot heartmatch_content -e "TRUNCATE TABLE post;"')

    # 动态内容
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

    cities = ["北京", "上海", "深圳", "广州", "杭州", "成都", "武汉", "南京", "西安", "苏州"]

    # 生成 SQL
    sql_lines = ["USE heartmatch_content;", "", "SET SESSION sql_mode='';", ""]
    sql_lines.append("INSERT INTO post (user_id, content, type, media_urls, location, topic_id, like_count, comment_count, share_count, view_count, status, audit_status, created_at) VALUES")

    first = True
    total_images = 0

    for user_id in range(1, 51):
        post_count = random.randint(1, 3)

        for j in range(post_count):
            content = random.choice(contents).replace("'", "''")

            # 随机位置
            if random.random() > 0.3:
                location = f"'{random.choice(cities)}'"
            else:
                location = "NULL"

            topic_id = random.randint(1, 10)
            like_count = random.randint(0, 100)
            comment_count = random.randint(0, 20)
            share_count = random.randint(0, 10)
            view_count = like_count * random.randint(3, 8)

            # 随机时间 (7天内)
            hours_ago = random.randint(1, 168)
            created_at = run_cmd(f"date -d '{hours_ago} hours ago' '+%Y-%m-%d %H:%M:%S'")

            # 随机获取1-3张图片
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

            # 序列化媒体 URLs
            if images:
                # 转义单引号为 SQL 安全格式
                media_urls = json.dumps(images).replace("'", "''")
            else:
                media_urls = "[]"

            # 添加到 SQL
            if first:
                first = False
            else:
                sql_lines.append(",")

            line = f"({user_id}, '{content}', 1, '{media_urls}', {location}, {topic_id}, {like_count}, {comment_count}, {share_count}, {view_count}, 1, 1, '{created_at}')"
            sql_lines.append(line)

    sql_lines.append(";")

    # 写入临时文件
    sql_file = "/tmp/insert_posts.sql"
    with open(sql_file, "w") as f:
        f.write("\n".join(sql_lines))

    print()
    print("插入动态到数据库...")

    # 执行 SQL
    with open(sql_file, "r") as f:
        result = subprocess.run(
            ["docker", "exec", "-i", "heartmatch-mysql", "mysql", "-uroot", "-proot"],
            stdin=f, capture_output=True, text=True
        )

    if result.stderr:
        stderr = result.stderr.replace("mysql: [Warning]", "").strip()
        if stderr and "ERROR" in stderr:
            print(f"SQL Error: {stderr}")

    # 验证
    user_count = run_cmd('docker exec heartmatch-mysql mysql -uroot -proot heartmatch_user -N -e "SELECT COUNT(*) FROM user;"')
    post_count = run_cmd('docker exec heartmatch-mysql mysql -uroot -proot heartmatch_content -N -e "SELECT COUNT(*) FROM post;"')
    topic_count = run_cmd('docker exec heartmatch-mysql mysql -uroot -proot heartmatch_content -N -e "SELECT COUNT(*) FROM topic;"')

    print()
    print("=" * 50)
    print("数据生成完成!")
    print("=" * 50)
    print()
    print("统计信息:")
    print(f"  - 用户数: {user_count}")
    print(f"  - 动态数: {post_count}")
    print(f"  - 话题数: {topic_count}")
    print(f"  - 图片数: {total_images}")
    print()
    print("测试账号:")
    print("  用户名: user001 ~ user050")
    print("  密码:   123456")
    print()
    print("现在可以测试 Feed 模块了!")

if __name__ == "__main__":
    main()