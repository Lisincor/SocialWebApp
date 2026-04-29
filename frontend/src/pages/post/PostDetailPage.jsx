import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { getPostById, likePost, sharePost } from '../../services/feed';
import { useAuthStore } from '../../stores/authStore';
import Avatar from '../../components/common/Avatar';
import CommentList from '../../components/feed/CommentList';
import toast from 'react-hot-toast';

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);

  const fetchPostDetail = async () => {
    setIsLoading(true);
    try {
      const data = await getPostById(postId);
      setPost(data);
      setIsLiked(data.isLiked || false);
      setLikeCount(data.likeCount || 0);
    } catch (error) {
      console.error('Failed to fetch post:', error);
      toast.error('获取动态详情失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await likePost(postId);
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      toast.success(isLiked ? '取消点赞' : '点赞成功');
    } catch (error) {
      toast.error(error.message || '操作失败');
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/post/${postId}`;
    const shareText = post?.content?.slice(0, 100) || '分享动态';

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          text: `${post?.nickname || '用户'}的动态`,
          url: shareUrl,
        });
        await sharePost(postId);
      } catch (err) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(shareUrl);
          toast.success('链接已复制到剪贴板');
        }
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('链接已复制到剪贴板');
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr.replace(' ', 'T'));
    return date.toLocaleString('zh-CN');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">加载中...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">动态不存在</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-3 flex items-center justify-between border-b">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="font-medium">动态详情</span>
        <button className="p-2 -mr-2">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* Post Content */}
      <div className="bg-white">
        {/* Author */}
        <div className="flex items-center p-4">
          <Avatar src={post.avatar} name={post.nickname} size="large" />
          <div className="ml-3 flex-1">
            <div className="font-medium">{post.nickname || '用户' + post.userId}</div>
            <div className="text-sm text-gray-500">{formatTime(post.createdAt)}</div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Location */}
        {post.location && (
          <div className="px-4 pb-2 text-sm text-gray-500">
            📍 {post.location}
          </div>
        )}

        {/* Media */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="px-4 pb-4">
            {post.mediaUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt=""
                className="w-full rounded-lg mb-2"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="px-4 py-3 flex items-center justify-between border-t">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likeCount}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-500"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.commentCount || 0}</span>
          </button>
          <button onClick={handleShare} className="flex items-center space-x-2 text-gray-500">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 bg-white rounded-lg">
          <div className="px-4 py-3 border-b">
            <span className="font-medium">评论 ({post.commentCount || 0})</span>
          </div>
          <CommentList
            postId={postId}
            commentCount={post.commentCount || 0}
            currentUserId={user?.id}
          />
        </div>
      )}
    </div>
  );
};

export default PostDetailPage;