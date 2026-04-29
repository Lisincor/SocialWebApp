#!/bin/bash
# HeartMatch 测试数据生成脚本 - 生成动态

IMGBB_KEY="a7eaf08c4d8ec70671e7ab5c8f4b56fd"

echo "开始生成动态数据..."
echo "正在下载图片并上传到 imgBB (这可能需要几分钟)"

# 动态内容数组
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
    "运动打卡，坚持就是胜利"
    "今天完成了重要的项目"
    "养宠物的人一定很有爱心"
    "音乐让生活更美好"
    "每天进步一点点"
)

cities=("北京" "上海" "深圳" "广州" "杭州" "成都" "武汉" "南京" "西安" "苏州")

# 清空现有动态
docker exec heartmatch-mysql mysql -uroot -proot heartmatch_content -e "TRUNCATE TABLE post;" 2>/dev/null

# 创建临时SQL文件
SQL_FILE="/tmp/insert_posts.sql"
echo "USE heartmatch_content;" > "$SQL_FILE"
echo "" >> "$SQL_FILE"
echo "SET SESSION sql_mode='';" >> "$SQL_FILE"
echo "INSERT INTO post (user_id, content, type, media_urls, location, topic_id, like_count, comment_count, share_count, view_count, status, audit_status, created_at) VALUES" >> "$SQL_FILE"

total_posts=0
first_record=true

for user_id in {1..50}; do
    # 每个用户1-3条动态
    post_count=$((1 + RANDOM % 3))

    for ((j=0; j<post_count; j++)); do
        total_posts=$((total_posts + 1))

        # 随机内容 (转义单引号)
        content_idx=$((RANDOM % ${#contents[@]}))
        raw_content="${contents[$content_idx]}"
        content="${raw_content//"'"/"\\'"}

        # 随机位置
        if [ $((RANDOM % 10)) -gt 3 ]; then
            city=${cities[$((RANDOM % 10))]}
            location="'${city}'"
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

        # 随机获取1-3张图片 (减少图片数以加快速度)
        img_count=$((1 + RANDOM % 3))
        media_urls="["
        first_img=true

        for ((k=0; k<img_count; k++)); do
            seed=$((1 + RANDOM % 500))

            # 从 picsum 下载图片并转成 base64
            img_b64=$(curl -sL "https://picsum.photos/seed/${seed}/800/800" 2>/dev/null | base64 2>/dev/null)

            if [ -n "$img_b64" ] && [ ${#img_b64} -gt 100 ]; then
                # 上传到 imgBB
                imgbb_response=$(curl -s --connect-timeout 10 --max-time 30 \
                    -X POST "https://api.imgbb.com/1/upload?key=${IMGBB_KEY}" \
                    -F "image=${img_b64}" \
                    -F "name=post_${seed}.jpg" 2>/dev/null)

                img_url=$(echo "$imgbb_response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data',{}).get('url',''))" 2>/dev/null)

                if [ -n "$img_url" ] && [ "$img_url" != "None" ] && [ ${#img_url} -gt 10 ]; then
                    # 转义 URL 中的特殊字符
                    escaped_url="${img_url//"'"/"\\'"}"

                    if [ "$first_img" = true ]; then
                        first_img=false
                    else
                        media_urls="${media_urls},"
                    fi
                    media_urls="${media_urls}\"${escaped_url}\""
                    echo -n "."
                fi
            fi

            sleep 0.2
        done

        media_urls="${media_urls}]"

        # 如果没有图片，设置空数组
        if [ "$media_urls" = "[]" ] || [ "$media_urls" = "[null]" ]; then
            media_urls="'[]'"
        else
            media_urls="'${media_urls}'"
        fi

        # 写入 SQL
        if [ $first_record = true ]; then
            first_record=false
        else
            echo "," >> "$SQL_FILE"
        fi

        echo -n "(${user_id}, '${content}', 1, ${media_urls}, ${location}, ${topic_id}, ${like_count}, ${comment_count}, ${share_count}, ${view_count}, 1, 1, '${created_at}')" >> "$SQL_FILE"
    done
done

echo ";" >> "$SQL_FILE"

echo ""
echo "插入动态到数据库..."

# 执行 SQL
cat "$SQL_FILE" | docker exec -i heartmatch-mysql mysql -uroot -proot 2>&1 | grep -v Warning

# 验证
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
echo "现在可以测试 Feed 模块了!"
echo ""