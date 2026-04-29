import { Heart, MessageCircle, Send, Bookmark, Share2 } from 'lucide-react';

const VideoControls = ({ video, onLike, onComment, onShare, onBookmark, isLiked, isBookmarked }) => {
  return (
    <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6">
      {/* User Avatar */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
          <img
            src={video.userAvatar || 'https://via.placeholder.com/48'}
            alt={video.username}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">+</span>
        </div>
      </div>

      {/* Like Button */}
      <button
        onClick={onLike}
        className="flex flex-col items-center gap-1"
      >
        <div className={`w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all ${
          video.isLiked ? 'scale-110' : ''
        }`}>
          <Heart
            className={`w-7 h-7 transition-colors ${
              video.isLiked ? 'text-red-500 fill-current' : 'text-white'
            }`}
          />
        </div>
        <span className="text-white text-xs">{video.likeCount || 0}</span>
      </button>

      {/* Comment Button */}
      <button
        onClick={onComment}
        className="flex flex-col items-center gap-1"
      >
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <MessageCircle className="w-7 h-7 text-white" />
        </div>
        <span className="text-white text-xs">{video.commentCount || 0}</span>
      </button>

      {/* Bookmark Button */}
      <button
        onClick={onBookmark}
        className="flex flex-col items-center gap-1"
      >
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Bookmark
            className={`w-7 h-7 ${
              video.isBookmarked ? 'text-yellow-400 fill-current' : 'text-white'
            }`}
          />
        </div>
        <span className="text-white text-xs">{video.bookmarkCount || 0}</span>
      </button>

      {/* Share Button */}
      <button
        onClick={onShare}
        className="flex flex-col items-center gap-1"
      >
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Share2 className="w-7 h-7 text-white" />
        </div>
        <span className="text-white text-xs">分享</span>
      </button>

      {/* Music Disc */}
      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
        <img
          src={video.musicCover || 'https://via.placeholder.com/48'}
          alt="music"
          className="w-full h-full object-cover animate-spin"
          style={{ animationDuration: '3s' }}
        />
      </div>
    </div>
  );
};

export default VideoControls;
