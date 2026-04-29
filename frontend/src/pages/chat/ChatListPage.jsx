import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useChatStore } from '../../stores/chatStore';
import Avatar from '../../components/common/Avatar';
import { Search, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ChatListPage = () => {
  const navigate = useNavigate();
  const { conversations, fetchConversations, unreadCount } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      await fetchConversations();
    } catch (error) {
      toast.error('获取会话列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter conversations by search
  const filteredConversations = conversations.filter((conv) =>
    conv.targetUser?.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort by last message time
  const sortedConversations = [...filteredConversations].sort(
    (a, b) => new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">消息</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                {unreadCount} 条新消息
              </span>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索聊天记录..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="max-w-lg mx-auto">
        {sortedConversations.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">暂无消息</p>
            <p className="text-gray-400 text-sm">开始匹配并聊天吧</p>
            <Link
              to="/match"
              className="mt-4 px-6 py-2 bg-primary-500 text-white font-medium rounded-full hover:bg-primary-600 transition-colors"
            >
              去匹配
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedConversations.map((conversation) => (
              <Link
                key={conversation.id}
                to={`/chat/${conversation.id}`}
                className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 transition-colors"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Avatar
                    src={conversation.targetUser?.avatar}
                    name={conversation.targetUser?.nickname}
                    size="large"
                  />
                  {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold truncate ${conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                      {conversation.targetUser?.nickname || '未知用户'}
                    </h3>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                      {conversation.lastMessage || '暂无消息'}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-primary-500 text-white text-xs font-medium rounded-full flex-shrink-0">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Format time helper
const formatTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;

  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
};

export default ChatListPage;