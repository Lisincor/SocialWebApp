import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFeedStore } from '../../stores/feedStore';
import { useAuthStore } from '../../stores/authStore';
import Avatar from '../../components/common/Avatar';
import StoriesBar from '../../components/feed/StoriesBar';
import FeedCard from '../../components/feed/FeedCard';
import { RefreshCw } from 'lucide-react';

const HomePage = () => {
  const { posts, fetchFeed, isLoading, hasMore } = useFeedStore();
  const { user } = useAuthStore();
  const [feedType, setFeedType] = useState('recommend');

  useEffect(() => {
    fetchFeed(feedType, true);
  }, [feedType]);

  const handleRefresh = () => {
    fetchFeed(feedType, true);
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      fetchFeed(feedType);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Stories Bar */}
      <StoriesBar />

      {/* Feed Type Tabs */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-100">
        <div className="flex max-w-lg mx-auto">
          {['recommend', 'following'].map((type) => (
            <button
              key={type}
              onClick={() => {
                setFeedType(type);
                fetchFeed(type, true);
              }}
              className={`
                flex-1 py-3 text-sm font-medium transition-all relative
                ${feedType === type ? 'text-gray-900' : 'text-gray-500'}
              `}
            >
              {type === 'recommend' ? '推荐' : '关注'}
              {feedType === type && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gray-900 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Content */}
      <div className="max-w-lg mx-auto">
        {posts.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <RefreshCw className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">暂无内容</p>
            <button
              onClick={handleRefresh}
              className="text-primary-500 hover:underline"
            >
              刷新试试
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {posts.map((post) => (
              <FeedCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && posts.length > 0 && (
          <div className="py-6 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              {isLoading ? '加载中...' : '加载更多'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
