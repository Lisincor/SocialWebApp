import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { getFollowingStories } from '../../services/feed';

const StoriesBar = () => {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      // 获取关注者故事（暂时传空数组，后续根据实际关注列表获取）
      const data = await getFollowingStories([]);
      setStories(data || []);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 添加"我的故事"作为第一个
  const displayStories = [
    { id: 'own', username: '我的故事', avatar: null, hasStory: false, isOwn: true, viewed: false },
    ...stories.map(s => ({
      id: s.id,
      username: s.nickname || '用户',
      avatar: s.avatar || s.thumbnailUrl,
      hasStory: true,
      viewed: s.viewed || false,
      isOwn: false,
    })),
  ];

  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="flex overflow-x-auto hide-scrollbar py-3 px-2">
        {displayStories.map((story) => (
          <Link
            key={story.id}
            to={story.isOwn ? '/story/create' : `/story/${story.id}`}
            className="flex flex-col items-center gap-1 px-2 flex-shrink-0"
          >
            {/* Avatar with ring */}
            <div
              className={`
                p-0.5 rounded-full
                ${story.isOwn
                  ? 'bg-gray-200'
                  : story.viewed
                    ? 'bg-gray-300'
                    : 'bg-gradient-to-tr from-secondary-500 via-primary-500 to-accent-500'
                }
              `}
            >
              <Avatar
                src={story.avatar}
                alt={story.username}
                size="md"
                ring={false}
              />
            </div>

            {/* Username */}
            <span className="text-xs text-gray-600 truncate max-w-[60px]">
              {story.isOwn ? '+' : story.username}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StoriesBar;