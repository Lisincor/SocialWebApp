-- HeartMatch 所有数据库初始化脚本

-- 创建所有需要的数据库
CREATE DATABASE IF NOT EXISTS heartmatch_user;
CREATE DATABASE IF NOT EXISTS heartmatch_content;
CREATE DATABASE IF NOT EXISTS heartmatch_match;
CREATE DATABASE IF NOT EXISTS heartmatch_im;
CREATE DATABASE IF NOT EXISTS heartmatch_video;
CREATE DATABASE IF NOT EXISTS heartmatch_live;
CREATE DATABASE IF NOT EXISTS heartmatch_pay;

-- 设置默认字符集
ALTER DATABASE heartmatch_user CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER DATABASE heartmatch_content CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER DATABASE heartmatch_match CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER DATABASE heartmatch_im CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER DATABASE heartmatch_video CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER DATABASE heartmatch_live CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER DATABASE heartmatch_pay CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
