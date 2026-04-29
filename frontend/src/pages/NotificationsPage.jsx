import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Gift } from 'lucide-react';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now
    setTimeout(() => {
      setNotifications([
        { id: 1, type: 'like', user: { nickname: '小明', avatar: '' }, content: '点赞了你的动态', time: '刚刚' },
        { id: 2, type: 'comment', user: { nickname: '小红', avatar: '' }, content: '评论：写得真好！', time: '5分钟前' },
        { id: 3, type: 'match', user: { nickname: '阳光男孩', avatar: '' }, content: '你们匹配成功', time: '1小时前' },
        { id: 4, type: 'follow', user: { nickname: '可爱猫咪', avatar: '' }, content: '关注了你', time: '3小时前' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'like': return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment': return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'match': return <Gift className="w-5 h-5 text-pink-500" />;
      case 'follow': return <UserPlus className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-3 flex items-center justify-between border-b">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-medium">消息通知</span>
        <button className="text-primary-500 text-sm">全部已读</button>
      </div>

      {/* Notifications List */}
      <div className="divide-y">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-center p-4 bg-white hover:bg-gray-50 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              {notification.user.avatar ? (
                <img src={notification.user.avatar} alt="" className="w-full h-full rounded-full" />
              ) : (
                getIcon(notification.type)
              )}
            </div>
            <div className="ml-3 flex-1">
              <div className="font-medium text-gray-900">
                <span className="text-primary-500">{notification.user.nickname}</span>
                <span className="text-gray-600"> {notification.content}</span>
              </div>
              <div className="text-sm text-gray-400 mt-1">{notification.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>暂无通知</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;