const ProfileTabs = ({ activeTab, onTabChange, tabs = [] }) => {
  const defaultTabs = [
    { key: 'posts', label: '帖子', icon: '📷' },
    { key: 'likes', label: '获赞', icon: '❤️' },
    { key: 'matches', label: '匹配', icon: '💕' },
  ];

  const tabList = tabs.length > 0 ? tabs : defaultTabs;

  return (
    <div className="sticky top-14 z-30 bg-white border-b border-gray-100">
      <div className="max-w-lg mx-auto flex">
        {tabList.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 py-3 text-sm font-medium transition-all relative flex items-center justify-center gap-1 ${
              activeTab === tab.key ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gray-900 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;