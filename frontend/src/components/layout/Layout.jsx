import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import Header from './Header';
import { useAuthStore } from '../../stores/authStore';

const Layout = ({ hideHeader = false, hideBottomNav = false, transparentHeader = false }) => {
  const { isLoggedIn } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {!hideHeader && (
        <Header transparent={transparentHeader} showNotifications={isLoggedIn} />
      )}

      {/* Main Content */}
      <main
        className={`
          ${hideHeader ? '' : 'pt-14'}
          ${hideBottomNav ? 'pb-0' : 'pb-20'}
          min-h-screen
        `}
      >
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      {!hideBottomNav && isLoggedIn && <BottomNav />}
    </div>
  );
};

export default Layout;
