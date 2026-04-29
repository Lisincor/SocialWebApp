import { Link } from 'react-router-dom';
import { Search, Bell, PlusSquare, Heart } from 'lucide-react';

const Header = ({
  title = '心动社交',
  showBack = false,
  onBack,
  showSearch = true,
  showNotifications = true,
  showPost = false,
  showLogo = true,
  rightContent,
  transparent = false,
}) => {
  const backButton = showBack && (
    <button
      onClick={onBack}
      className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );

  const searchButton = showSearch && (
    <Link
      to="/search"
      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
    >
      <Search className="w-6 h-6" />
    </Link>
  );

  const notificationsButton = showNotifications && (
    <Link
      to="/notifications"
      className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative"
    >
      <Bell className="w-6 h-6" />
      {/* Notification badge */}
      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
    </Link>
  );

  const postButton = showPost && (
    <Link
      to="/post/create"
      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
    >
      <PlusSquare className="w-6 h-6" />
    </Link>
  );

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-40 h-14
        ${transparent ? 'bg-transparent' : 'bg-white'}
        ${transparent ? '' : 'border-b border-gray-200'}
      `}
    >
      <div className="flex items-center justify-between h-full px-4 max-w-lg mx-auto">
        {/* Left */}
        <div className="flex items-center gap-2 min-w-[48px]">
          {backButton || <div className="w-10" />}
        </div>

        {/* Center */}
        <div className="flex items-center justify-center">
          {showLogo ? (
            <Link to="/" className="flex items-center gap-2">
              <Heart className="w-7 h-7 text-primary-500" fill="currentColor" />
              <span className="text-lg font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500">
                心动
              </span>
            </Link>
          ) : (
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-1 min-w-[48px] justify-end">
          {rightContent || (
            <>
              {postButton}
              {searchButton}
              {notificationsButton}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
