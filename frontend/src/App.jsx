import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';

// Layout
import Layout from './components/layout/Layout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';

// Main Pages
import HomePage from './pages/home/HomePage';
import DiscoverPage from './pages/discover/DiscoverPage';
import MatchPage from './pages/match/MatchPage';
import ChatListPage from './pages/chat/ChatListPage';
import ChatRoomPage from './pages/chat/ChatRoomPage';
import ProfilePage from './pages/profile/ProfilePage';
import EditProfilePage from './pages/profile/EditProfilePage';
import PostDetailPage from './pages/post/PostDetailPage';
import CreatePostPage from './pages/post/CreatePostPage';
import VipPage from './pages/vip/VipPage';
import WalletPage from './pages/vip/WalletPage';
import SearchPage from './pages/SearchPage';
import NotificationsPage from './pages/NotificationsPage';
import TopicSquarePage from './pages/topic/TopicSquarePage';

// Guard component for protected routes
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public route guard (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/match" element={<MatchPage />} />
          <Route path="/chat" element={<ChatListPage />} />
          <Route path="/chat/:conversationId" element={<ChatRoomPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:uid" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/post/:postId" element={<PostDetailPage />} />
          <Route path="/post/create" element={<CreatePostPage />} />
          <Route path="/vip" element={<VipPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/topics" element={<TopicSquarePage />} />
          <Route path="/topic/:topicId" element={<TopicSquarePage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
