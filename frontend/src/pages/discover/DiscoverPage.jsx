import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideoStore } from '../../stores/videoStore';
import { useAuthStore } from '../../stores/authStore';
import VideoControls from '../../components/video/VideoControls';
import VideoOverlay from '../../components/video/VideoOverlay';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { X, MessageCircle, Send, Bookmark, Share2, MoreHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

const DiscoverPage = () => {
  const navigate = useNavigate();
  const { videos, fetchVideos, likeVideo, isLoading, hasMore, currentIndex, setCurrentIndex } = useVideoStore();
  const { user } = useAuthStore();

  const containerRef = useRef(null);
  const videoRefs = useRef({});
  const [isMuted, setIsMuted] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Fetch videos on mount
  useEffect(() => {
    fetchVideos(true);
  }, []);

  // Handle scroll to change video
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const itemHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / itemHeight);

    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < videos.length) {
      setCurrentIndex(newIndex);

      // Pause previous video
      Object.values(videoRefs.current).forEach((video) => {
        if (video) video.pause();
      });

      // Play new video
      const currentVideo = videoRefs.current[newIndex];
      if (currentVideo) {
        currentVideo.play().catch(() => {});
      }
    }
  }, [currentIndex, videos.length, setCurrentIndex]);

  // Play/pause video based on visibility
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.play().catch(() => {});
    }

    // Pause others
    return () => {
      Object.values(videoRefs.current).forEach((video) => {
        if (video) video.pause();
      });
    };
  }, [currentIndex]);

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    Object.values(videoRefs.current).forEach((video) => {
      if (video) video.muted = !isMuted;
    });
  };

  // Handle like
  const handleLike = async (videoId) => {
    if (!user) {
      toast.error('请先登录');
      return;
    }
    try {
      await likeVideo(videoId);
    } catch (error) {
      toast.error('操作失败');
    }
  };

  // Handle share
  const handleShare = (video) => {
    if (navigator.share) {
      navigator.share({
        title: 'HeartMatch Video',
        text: video.description,
        url: `/discover/${video.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/discover/${video.id}`);
      toast.success('链接已复制');
    }
  };

  // Handle comment
  const handleComment = () => {
    setShowComment(true);
  };

  const submitComment = () => {
    if (commentText.trim()) {
      toast.success('评论发送成功');
      setCommentText('');
      setShowComment(false);
    }
  };

  // Load more when reaching bottom
  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      fetchVideos();
    }
  };

  if (videos.length === 0 && isLoading) {
    return (
      <div className="fixed inset-0 bg-dark-300 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black"
      onScroll={handleScroll}
    >
      {/* Mute Toggle Button */}
      <button
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-black/50 backdrop-blur-sm"
      >
        {isMuted ? (
          <span className="text-white text-xl">🔇</span>
        ) : (
          <span className="text-white text-xl">🔊</span>
        )}
      </button>

      {/* Videos */}
      {videos.map((video, index) => (
        <div
          key={video.id}
          className="h-screen w-screen snap-start relative flex items-center justify-center bg-black"
        >
          {/* Video Element */}
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={video.videoUrl}
            className="h-full w-full object-cover"
            loop
            playsInline
            muted={isMuted}
            onClick={() => {
              const v = videoRefs.current[index];
              if (v) {
                v.paused ? v.play() : v.pause();
              }
            }}
          />

          {/* Overlay - Left Side (User Info) */}
          <VideoOverlay video={video} position="left" />

          {/* Controls - Right Side */}
          <VideoControls
            video={video}
            onLike={() => handleLike(video.id)}
            onComment={handleComment}
            onShare={() => handleShare(video)}
            onBookmark={() => toast.success('已收藏')}
          />

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
            <div
              className="h-full bg-primary-500 transition-all duration-100"
              style={{ width: '30%' }}
            />
          </div>

          {/* Description (Bottom) */}
          <div className="absolute bottom-20 left-4 right-20">
            <p className="text-white text-sm font-medium truncate">
              @{video.username}
            </p>
            <p className="text-white text-xs mt-1 line-clamp-2">
              {video.description}
            </p>
            {video.music && (
              <p className="text-white/70 text-xs mt-2 flex items-center gap-1">
                <span>🎵</span>
                {video.music}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Load More Trigger */}
      {hasMore && (
        <div className="h-20 flex items-center justify-center">
          {isLoading && <LoadingSpinner />}
        </div>
      )}

      {/* Empty State */}
      {videos.length === 0 && !isLoading && (
        <div className="h-screen flex flex-col items-center justify-center text-white">
          <p className="text-lg mb-4">暂无推荐内容</p>
          <button
            onClick={() => fetchVideos(true)}
            className="px-6 py-2 bg-primary-500 rounded-full"
          >
            刷新
          </button>
        </div>
      )}

      {/* Comment Modal */}
      {showComment && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowComment(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-dark-200 rounded-t-3xl p-4 max-h-[70vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">{videos[currentIndex]?.commentCount || 0} 条评论</h3>
              <button onClick={() => setShowComment(false)}>
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Comments List */}
            <div className="max-h-[40vh] overflow-y-auto mb-4">
              {/* Placeholder comments */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm">
                      <span className="font-medium">用户{i}</span>
                      <span className="text-gray-400 text-xs ml-2">2小时前</span>
                    </p>
                    <p className="text-white/80 text-sm mt-1">评论内容 {i}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <div className="flex gap-3 items-center border-t border-gray-700 pt-4">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0" />
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="留下你的评论..."
                className="flex-1 bg-gray-700 text-white text-sm px-4 py-2 rounded-full focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && submitComment()}
              />
              <button
                onClick={submitComment}
                className="text-primary-500 font-medium text-sm"
                disabled={!commentText.trim()}
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;