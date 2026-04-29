import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Users, TrendingUp } from 'lucide-react';
import { useUserStore } from '../stores/userStore';

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { users, searchUsers, loading } = useUserStore();

  const handleSearch = async () => {
    if (query.trim()) {
      await searchUsers(query);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
            <SearchIcon className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索用户..."
              className="ml-2 flex-1 bg-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Quick Links */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">快捷入口</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center p-4 bg-white rounded-xl shadow-sm">
              <Users className="w-6 h-6 text-primary-500 mr-3" />
              <span className="font-medium">附近的人</span>
            </button>
            <button className="flex items-center p-4 bg-white rounded-xl shadow-sm">
              <TrendingUp className="w-6 h-6 text-accent-500 mr-3" />
              <span className="font-medium">热门用户</span>
            </button>
          </div>
        </div>

        {/* Search Results */}
        {users.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">搜索结果</h3>
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => navigate(`/profile/${user.uid}`)}
                  className="flex items-center p-4 bg-white rounded-xl shadow-sm cursor-pointer"
                >
                  <img src={user.avatar || '/default-avatar.png'} alt="" className="w-12 h-12 rounded-full" />
                  <div className="ml-3 flex-1">
                    <div className="font-medium">{user.nickname}</div>
                    <div className="text-sm text-gray-500">{user.city || '未知'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {query && users.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-400">
            未找到相关用户
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;