import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';
import Avatar from '../../components/common/Avatar';
import ProfileTabs from '../../components/profile/ProfileTabs';
import PostGrid from '../../components/profile/PostGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import LogoutModal from '../../components/common/LogoutModal';
import { Settings, Edit2, UserPlus, UserCheck, MessageCircle, Crown, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const { profile, fetchUserProfile, isLoading, posts, fetchUserPosts, isFollowing, followUser, unfollowUser } = useUserStore();

  const [activeTab, setActiveTab] = useState('posts');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // Use uid if available, otherwise use currentUser's uid
  const profileUid = uid || currentUser?.uid;
  const isOwnProfile = !uid || uid === currentUser?.uid;

  useEffect(() => {
    const targetUid = profileUid;
    if (targetUid) {
      fetchUserProfile(targetUid);
      fetchUserPosts(targetUid);
    }
  }, [uid, currentUser]);

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error('请先登录');
      return;
    }
    try {
      if (isFollowing) {
        await unfollowUser(profile.id);
      } else {
        await followUser(profile.id);
      }
    } catch (error) {
      toast.error('操作失败');
    }
  };

  const renderHeader = () => (
    <div className="bg-gradient-to-b from-pink-50 to-white">
      {/* Back Button for other profiles */}
      {!isOwnProfile && (
        <div className="px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 pb-6">
        {/* Avatar & Stats */}
        <div className="flex items-start gap-4 mb-6">
          <Avatar
            src={profile?.avatar}
            name={profile?.nickname}
            size="xl"
            className="border-4 border-white shadow-lg"
          />

          <div className="flex-1">
            {/* Stats Row */}
            <div className="flex justify-around mb-4">
              <StatItem value={profile?.postsCount || 0} label="帖子" />
              <StatItem value={profile?.followersCount || 0} label="粉丝" />
              <StatItem value={profile?.followingCount || 0} label="关注" />
              <StatItem value={profile?.likesReceived || 0} label="获赞" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isOwnProfile ? (
                <>
                  <Link
                    to="/profile/edit"
                    className="flex-1 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg text-center hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    编辑资料
                  </Link>
                  <button onClick={() => setShowLogoutModal(true)} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <Settings className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleFollow}
                    className={`flex-1 py-2 font-medium rounded-lg text-center transition-colors flex items-center justify-center gap-2 ${
                      isFollowing
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4" />
                        已关注
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        关注
                      </>
                    )}
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-gray-900">{profile?.nickname}</h1>
            {profile?.isVerified && (
              <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </span>
            )}
            {profile?.isVip && (
              <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-xs text-white font-medium flex items-center gap-1">
                <Crown className="w-3 h-3" />
                VIP
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{profile?.bio || '这个人很懒，什么都没写'}</p>
        </div>

        {/* Tags */}
        {profile?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {profile.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-pink-50 text-primary-500 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {renderHeader()}
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="max-w-lg mx-auto">
        {activeTab === 'posts' && <PostGrid posts={posts} />}
        {activeTab === 'likes' && (
          <div className="py-10 text-center text-gray-400">暂无点赞内容</div>
        )}
        {activeTab === 'matches' && (
          <div className="py-10 text-center text-gray-400">暂无匹配记录</div>
        )}
      </div>

      {/* Logout Modal */}
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
    </div>
  );
};

const StatItem = ({ value, label }) => (
  <div className="text-center">
    <p className="text-xl font-bold text-gray-900">{formatNumber(value)}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const formatNumber = (num) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num;
};

export default ProfilePage;