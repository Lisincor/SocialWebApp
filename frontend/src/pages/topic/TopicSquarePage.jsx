import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, MapPin, Heart } from 'lucide-react';
import { getTrendingTopics, getTopics } from '../../services/feed';
import Avatar from '../../components/common/Avatar';

const TopicSquarePage = () => {
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [categories, setCategories] = useState([
    { id: 'all', name: '全部', icon: '🔥' },
    { id: 'interest', name: '兴趣', icon: '🎯' },
    { id: 'emotion', name: '情感', icon: '💕' },
    { id: 'activity', name: '活动', icon: '📅' },
    { id: 'city', name: '同城', icon: '📍' },
  ]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [topics, setTopics] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTrendingTopics();
    fetchTopics();
  }, [selectedCategory]);

  const fetchTrendingTopics = async () => {
    try {
      const data = await getTrendingTopics(10);
      setTrendingTopics(data || []);
    } catch (error) {
      console.error('Failed to fetch trending topics:', error);
    }
  };

  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      const data = await getTopics(1, 20, selectedCategory === 'all' ? null : selectedCategory);
      setTopics(data?.list || data || []);
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchKeyword.trim()) return;
    // Navigate to search results
    window.location.href = `/search?topic=${encodeURIComponent(searchKeyword)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold">话题广场</h1>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索话题..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar px-4 pb-2 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4">
        {/* Trending Topics */}
        {selectedCategory === 'all' && trendingTopics.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-red-500" />
              <h2 className="font-semibold">热门话题</h2>
            </div>
            <div className="space-y-2">
              {trendingTopics.map((topic, index) => (
                <Link
                  key={topic.id}
                  to={`/topic/${topic.id}`}
                  className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-red-500 text-white' :
                      index === 1 ? 'bg-orange-500 text-white' :
                      index === 2 ? 'bg-yellow-500 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-medium text-gray-900">#{topic.name}</div>
                      <div className="text-xs text-gray-500">{topic.postCount || topic.followCount || 0} 讨论</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">{topic.hotScore || 0}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Topics */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">
              {categories.find(c => c.id === selectedCategory)?.name || '全部'}话题
            </h2>
            <span className="text-sm text-gray-500">{topics.length} 个话题</span>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-gray-400">加载中...</div>
          ) : topics.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              暂无话题，快来创建第一个话题吧
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {topics.map((topic) => (
                <Link
                  key={topic.id}
                  to={`/topic/${topic.id}`}
                  className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {topic.icon ? (
                      <span className="text-2xl">{topic.icon}</span>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-sm">
                        #
                      </div>
                    )}
                    <span className="font-medium text-gray-900 truncate">#{topic.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {topic.postCount || 0} 动态 · {topic.followCount || 0} 关注
                  </div>
                  {topic.description && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{topic.description}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicSquarePage;