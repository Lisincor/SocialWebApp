import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatchStore } from '../../stores/matchStore';
import { useAuthStore } from '../../stores/authStore';
import Avatar from '../../components/common/Avatar';
import SwipeButtons from '../../components/match/SwipeButtons';
import MatchPopup from '../../components/match/MatchPopup';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Heart, X, Sparkles, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const MatchPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { users, currentIndex, fetchUsers, swipeUser, matchResult, clearMatch, remainingLikes, fetchRemainingLikes } = useMatchStore();

  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null);
  const [showMatch, setShowMatch] = useState(false);
  const cardRef = useRef(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const translateXRef = useRef(0);
  const rotateRef = useRef(0);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers(true);
    fetchRemainingLikes();
  }, []);

  // Handle swipe
  const handleSwipe = async (action) => {
    if (isAnimating || currentIndex >= users.length) return;

    const currentUser = users[currentIndex];
    setDirection(action === 'like' ? 1 : action === 'superlike' ? 0.5 : -1);
    setIsAnimating(true);

    try {
      const result = await swipeUser(currentUser.id, action);

      // Show match popup if it's a match
      if (result?.isMatch) {
        setTimeout(() => {
          setShowMatch(true);
        }, 500);
      }
    } catch (error) {
      toast.error(error.message || '操作失���');
    }

    setTimeout(() => {
      setIsAnimating(false);
      setDirection(null);
    }, 300);

    // Fetch more users if running low
    if (currentIndex >= users.length - 3) {
      fetchUsers();
    }
  };

  // Handle drag start
  const handleDragStart = (e) => {
    startXRef.current = e.touches ? e.touches[0].clientX : e.clientX;
    startYRef.current = e.touches ? e.touches[0].clientY : e.clientY;
  };

  // Handle drag move
  const handleDragMove = (e) => {
    if (!startXRef.current) return;

    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;

    const deltaX = currentX - startXRef.current;
    const deltaY = currentY - startYRef.current;

    translateXRef.current = deltaX;
    rotateRef.current = deltaX * 0.05;

    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${deltaX}px) translateY(${deltaY * 0.3}px) rotate(${deltaX * 0.05}deg)`;
    }
  };

  // Handle drag end
  const handleDragEnd = (e) => {
    const deltaX = translateXRef.current;

    if (deltaX > 100) {
      handleSwipe('like');
    } else if (deltaX < -100) {
      handleSwipe('pass');
    } else {
      // Reset card position
      if (cardRef.current) {
        cardRef.current.style.transform = 'translateX(0) translateY(0) rotate(0)';
      }
    }

    startXRef.current = 0;
    startYRef.current = 0;
    translateXRef.current = 0;
    rotateRef.current = 0;
  };

  // Close match popup and start chat
  const handleStartChat = () => {
    clearMatch();
    setShowMatch(false);
    if (matchResult) {
      navigate(`/chat/${matchResult.conversationId}`);
    }
  };

  // Keep swiping
  const handleKeepSwiping = () => {
    clearMatch();
    setShowMatch(false);
  };

  // Get like count text
  const getLikeCountText = () => {
    if (remainingLikes === -1) return '';
    if (remainingLikes === 0) return '今日喜欢次数已用完';
    return `${remainingLikes} 次喜欢机会`;
  };

  const currentUserData = users[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">探索</h1>
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              remainingLikes > 5 ? 'bg-primary-50 text-primary-500' :
              remainingLikes > 0 ? 'bg-orange-50 text-orange-500' :
              'bg-gray-100 text-gray-500'
            }`}>
              {getLikeCountText()}
            </div>
            <button
              onClick={() => {
                fetchUsers(true);
                fetchRemainingLikes();
              }}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Stack */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Cards Container */}
        <div className="relative h-[500px]">
          {/* Loading State */}
          {users.length === 0 && currentIndex === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner size="large" />
            </div>
          )}

          {/* Next Card (Background) */}
          {currentIndex + 1 < users.length && (
            <div className="absolute inset-0 transform scale-95 translate-y-4 opacity-50">
              <UserCard user={users[currentIndex + 1]} />
            </div>
          )}

          {/* Current Card */}
          {currentUserData && (
            <div
              ref={cardRef}
              className={`absolute inset-0 transition-transform duration-300 ${
                isAnimating ? `transform translate-x-${direction > 0 ? '[200%]' : '[-200%]'} rotate-${direction > 0 ? '[30deg]' : '[-30deg]'}` : ''
              }`}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
              onMouseDown={handleDragStart}
              onMouseMove={(e) => isAnimating && handleDragMove(e)}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
            >
              <UserCard user={currentUserData} onLike={() => handleSwipe('like')} />
            </div>
          )}

          {/* Empty State */}
          {users.length > 0 && currentIndex >= users.length && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-3xl shadow-lg p-8">
              <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center mb-6">
                <Heart className="w-12 h-12 text-primary-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">今日缘分已尽</h2>
              <p className="text-gray-500 text-center mb-6">明天再来看看，也许会有新的惊喜</p>
              <button
                onClick={() => {
                  fetchUsers(true);
                  fetchRemainingLikes();
                }}
                className="px-8 py-3 bg-primary-500 text-white font-medium rounded-full hover:bg-primary-600 transition-colors"
              >
                刷新列表
              </button>
            </div>
          )}
        </div>

        {/* Swipe Buttons */}
        <SwipeButtons
          onPass={() => handleSwipe('pass')}
          onSuperLike={() => handleSwipe('superlike')}
          onLike={() => handleSwipe('like')}
          disabled={!currentUserData || isAnimating}
        />
      </div>

      {/* Match Popup */}
      {showMatch && matchResult && (
        <MatchPopup
          matchedUser={matchResult.matchedUser}
          onStartChat={handleStartChat}
          onKeepSwiping={handleKeepSwiping}
        />
      )}
    </div>
  );
};

// User Card Component
const UserCard = ({ user, onLike }) => {
  return (
    <div className="h-full bg-white rounded-3xl shadow-lg overflow-hidden relative">
      {/* Image */}
      <div className="relative h-full">
        <img
          src={user.avatar || 'https://via.placeholder.com/400x600'}
          alt={user.nickname}
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Like/Dislike Indicator */}
        <div
          className={`absolute top-8 left-8 px-4 py-2 rounded-lg border-4 font-bold text-xl transform rotate-[-20deg] ${
            onLike ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ borderColor: '#FF4B6E', color: '#FF4B6E' }}
        >
          {user.isLike ? 'LIKE' : user.isSuperLike ? 'SUPER LIKE' : 'NOPE'}
        </div>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold text-white">{user.nickname}</h2>
            <span className="text-white text-lg">{user.age}岁</span>
            {user.isVerified && <span className="text-blue-400">✓</span>}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {user.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-white/80 text-sm line-clamp-2">{user.bio}</p>
          )}
        </div>

        {/* VIP Badge */}
        {user.isVip && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
            <span className="text-white text-xs font-bold">VIP</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchPage;