import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Avatar from '../common/Avatar';
import { Heart, MessageCircle, Send, Bookmark, Share2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { viewPost, likePost, unlikePost, favoritePost, unfavoritePost } from '../../services/feed';

// 格式化时间
const formatTime = (dateStr) => {
  if (!dateStr) return '刚刚';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = (now - date) / 1000;

  if (diff < 60) return '刚刚';
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}天前`;
  return date.toLocaleDateString('zh-CN');
};

const FeedCard = ({ post, onLikeChange }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [isSaved, setIsSaved] = useState(post.isFavorited || false);
  const [isFollowing, setIsFollowing] = useState(false);
  const hasTrackedView = useRef(false);

  // Track view when card is visible
  useEffect(() => {
    if (!hasTrackedView.current && post.id) {
      hasTrackedView.current = true;
      viewPost(post.id).catch(() => {});
    }
  }, [post.id]);

  // Sync with parent when post data changes
  useEffect(() => {
    setIsLiked(post.isLiked || false);
    setLikeCount(post.likeCount || 0);
    setIsSaved(post.isFavorited || false);
  }, [post.isLiked, post.likeCount, post.isFavorited]);

  const handleLike = async () => {
    const newIsLiked = !isLiked;
    const newCount = newIsLiked ? likeCount + 1 : likeCount - 1;

    // Optimistic update
    setIsLiked(newIsLiked);
    setLikeCount(newCount);

    try {
      if (newIsLiked) {
        await likePost(post.id);
        toast.success('点赞成功');
      } else {
        await unlikePost(post.id);
        toast.success('取消点赞');
      }
      // Notify parent
      onLikeChange?.(post.id, newIsLiked);
    } catch (error) {
      // Revert on error
      setIsLiked(!newIsLiked);
      setLikeCount(newCount);
      toast.error(error.message || '操作失败');
    }
  };

  const handleSave = async () => {
    const newIsSaved = !isSaved;

    // Optimistic update
    setIsSaved(newIsSaved);

    try {
      if (newIsSaved) {
        await favoritePost(post.id);
        toast.success('已收藏');
      } else {
        await unfavoritePost(post.id);
        toast.success('取消收藏');
      }
    } catch (error) {
      // Revert on error
      setIsSaved(!newIsSaved);
      toast.error(error.message || '操作失败');
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? '取消关注' : '关注成功');
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/post/${post.id}`;
    const shareText = post.content?.slice(0, 100) || '分享动态';

    if (navigator.share) {
      navigator.share({
        title: shareText,
        text: `${post.nickname || '用户'}的动态`,
        url: shareUrl,
      }).then(() => {
        import('../../services/feed').then(({ sharePost }) => {
          sharePost(post.id).catch(() => {});
        });
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('链接已复制到剪贴板');
    }
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link to={`/profile/${post.userId}`} className="flex items-center gap-3">
          <Avatar src={post.avatar} name={post.nickname} size="medium" />
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">{post.nickname || '用户' + post.userId}</span>
            </div>
            {post.location ? (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>{post.location}</span>
              </div>
            ) : (
              <span className="text-xs text-gray-500">{post.createdAt ? formatTime(post.createdAt) : '刚刚'}</span>
            )}
          </div>
        </Link>

        <button
          onClick={handleFollow}
          className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
            isFollowing
              ? 'bg-gray-100 text-gray-600'
              : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
        >
          {isFollowing ? '已关注' : '关注'}
        </button>
      </div>

      {/* Media */}
      <div
        className="relative aspect-square bg-gray-100"
        onDoubleClick={handleLike}
      >
        {post.mediaUrls && post.mediaUrls.length > 0 ? (
          <img
            src={post.mediaUrls[0]}
            alt="post"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x400?text=Post';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span>暂无图片</span>
          </div>
        )}

        {/* Double tap heart animation */}
        {post.mediaType === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="text-white text-6xl">▶</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className="flex items-center gap-1">
              <Heart className={`w-6 h-6 transition-colors ${isLiked ? 'text-red-500 fill-current' : 'text-gray-700 hover:text-gray-900'}`} />
            </button>
            <button
              onClick={() => navigate(`/post/${post.id}`)}
              className="flex items-center gap-1"
            >
              <MessageCircle className="w-6 h-6 text-gray-700" />
            </button>
            <button onClick={handleShare} className="flex items-center gap-1">
              <Send className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          <button onClick={handleSave}>
            <Bookmark className={`w-6 h-6 ${isSaved ? 'text-yellow-500 fill-current' : 'text-gray-700'}`} />
          </button>
        </div>

        {/* Likes count */}
        <p className="font-semibold text-gray-900 mb-2">
          {likeCount > 0 ? `${likeCount.toLocaleString()} 个赞` : '成为第一个点赞的人'}
        </p>

        {/* Caption */}
        {post.content && (
          <p className="text-gray-800 mb-2">
            <span className="font-semibold">{post.nickname || '用户' + post.userId}</span>{' '}
            {post.content.length > 100 ? `${post.content.slice(0, 100)}...` : post.content}
          </p>
        )}

        {/* Hashtags */}
        {post.topicName && (
          <div className="mb-2">
            <Link
              to={`/topic/${post.topicId}`}
              className="text-sm text-primary-500 hover:underline"
            >
              {post.topicName}
            </Link>
          </div>
        )}

        {/* View comments */}
        {post.commentCount > 0 && (
          <button
            onClick={() => navigate(`/post/${post.id}`)}
            className="text-gray-500 text-sm mb-2"
          >
            查看全部 {post.commentCount} 条评论
          </button>
        )}

        {/* Add comment */}
        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100">
          <Avatar src={post.avatar} name="" size="small" />
          <input
            type="text"
            placeholder="添加评论..."
            className="flex-1 text-sm bg-transparent focus:outline-none"
          />
          <button className="text-primary-500 text-sm font-medium">发送</button>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;