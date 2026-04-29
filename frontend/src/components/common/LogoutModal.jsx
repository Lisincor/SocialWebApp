import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { LogOut, X } from 'lucide-react';
import toast from 'react-hot-toast';

const LogoutModal = ({ isOpen, onClose }) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!isOpen) return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('已退出登录');
      navigate('/');
      onClose();
    } catch (error) {
      toast.error('退出失败，请重试');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-[280px] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 text-center">确认退出</h3>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-500 text-center mb-6">
            确定要退出当前账号吗？
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoggingOut}
            >
              取消
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex-1 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoggingOut ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  退出
                </>
              )}
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Custom animation styles (add to index.css if needed)
// @keyframes scale-in {
//   from {
//     opacity: 0;
//     transform: scale(0.9);
//   }
//   to {
//     opacity: 1;
//     transform: scale(1);
//   }
// }
// .animate-scale-in {
//   animation: scale-in 0.2s ease-out;
// }

export default LogoutModal;
