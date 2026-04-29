import { NavLink } from 'react-router-dom';
import { Home, Compass, Heart, MessageCircle, User } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/discover', icon: Compass, label: '发现' },
  { path: '/match', icon: Heart, label: '匹配' },
  { path: '/chat', icon: MessageCircle, label: '消息' },
  { path: '/profile', icon: User, label: '我的' },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center gap-0.5 w-16 h-full
              transition-colors duration-200
              ${isActive ? 'text-primary-500' : 'text-gray-500'}
            `}
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-6 h-6 transition-transform duration-200 ${
                    isActive ? 'scale-110' : ''
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
