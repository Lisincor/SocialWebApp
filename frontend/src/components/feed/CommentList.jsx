import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { Heart, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { getComments, addComment, likeComment, deleteComment } from '../../services/feed';
import toast from 'react-hot-toast';

const CommentList = ({ postId, commentCount, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const data = await getComments(postId);
      console.log('Comments fetched:', data);
      setComments(data || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      toast.error('获取评论失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const comment = await addComment(postId, newComment);
      // 添加成功后将新评论添加到列表
      if (comment) {
        setComments([comment, ...comments]);
      } else {
        // 如果返回null，刷新评论列表
        await fetchComments();
      }
      setNewComment('');
      toast.success('评论成功');
    } catch (error) {
      console.error('Comment error:', error);
      toast.error(error.message || '评论失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    setIsLoading(true);
    try {
      const comment = await addComment(postId, replyContent, replyingTo.id);
      setComments(comments.map(c => {
        if (c.id === replyingTo.id) {
          return { ...c, replies: [...(c.replies || []), comment], replyCount: (c.replyCount || 0) + 1 };
        }
        return c;
      }));
      setReplyingTo(null);
      setReplyContent('');
      toast.success('回复成功');
    } catch (error) {
      toast.error(error.message || '回复失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await likeComment(commentId);
      setComments(comments.map(c => {
        if (c.id === commentId) {
          return { ...c, isLiked: !c.isLiked, likeCount: c.isLiked ? c.likeCount - 1 : c.likeCount + 1 };
        }
        if (c.replies) {
          return { ...c, replies: c.replies.map(r => {
            if (r.id === commentId) {
              return { ...r, isLiked: !r.isLiked, likeCount: r.isLiked ? r.likeCount - 1 : r.likeCount + 1 };
            }
            return r;
          })};
        }
        return c;
      }));
    } catch (error) {
      toast.error(error.message || '操作失败');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('确定删除这条评论？')) return;

    try {
      await deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
      toast.success('删除成功');
    } catch (error) {
      toast.error(error.message || '删除失败');
    }
  };

  const formatTime = (time) => {
    const date = new Date(time);
    const now = new Date();
    const diff = (now - date) / 1000;

    if (diff < 60) return '刚刚';
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="divide-y divide-gray-100">
      {/* Comment Input */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Avatar src={null} name="" size="small" />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="添加评论..."
              className="w-full resize-none border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
              rows={2}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isLoading}
                className="px-4 py-1.5 bg-primary-500 text-white text-sm font-medium rounded-full disabled:opacity-50"
              >
                发布
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="p-8 text-center text-gray-400">
          加载中...
        </div>
      ) : comments.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          暂无评论，快来抢沙发~
        </div>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="p-4">
            {/* Main Comment */}
            <div className="flex gap-3">
              <Link to={`/profile/${comment.userId}`}>
                <Avatar src={comment.avatar} name={comment.nickname} size="small" />
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Link to={`/profile/${comment.userId}`} className="font-medium text-gray-900 text-sm">
                    {comment.nickname || '匿名用户'}
                  </Link>
                  <span className="text-xs text-gray-400">{formatTime(comment.createdAt)}</span>
                </div>
                <p className="text-gray-800 text-sm mt-1">{comment.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-red-500"
                  >
                    <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    {comment.likeCount > 0 && <span className="text-xs">{comment.likeCount}</span>}
                  </button>
                  <button
                    onClick={() => setReplyingTo(comment)}
                    className="flex items-center gap-1 text-gray-500 hover:text-primary-500"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {comment.replyCount > 0 && <span className="text-xs">{comment.replyCount}</span>}
                  </button>
                  {comment.userId === currentUserId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-gray-400 hover:text-red-500 text-xs"
                    >
                      删除
                    </button>
                  )}
                </div>

                {/* Reply Input */}
                {replyingTo?.id === comment.id && (
                  <div className="mt-3 flex items-start gap-2">
                    <input
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={`回复 @${comment.nickname}...`}
                      className="flex-1 border border-gray-200 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:border-primary-500"
                      autoFocus
                    />
                    <button
                      onClick={handleReply}
                      disabled={!replyContent.trim() || isLoading}
                      className="p-1.5 text-primary-500 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setReplyingTo(null); setReplyContent(''); }}
                      className="p-1.5 text-gray-400"
                    >
                      取消
                    </button>
                  </div>
                )}

                {/* Replies */}
                {comment.replies?.length > 0 && (
                  <div className="mt-3 pl-3 border-l-2 border-gray-100 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-2">
                        <Link to={`/profile/${reply.userId}`}>
                          <Avatar src={reply.avatar} name={reply.nickname} size="extra-small" />
                        </Link>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Link to={`/profile/${reply.userId}`} className="font-medium text-gray-900 text-xs">
                              {reply.nickname || '匿名用户'}
                            </Link>
                            <span className="text-xs text-gray-400">{formatTime(reply.createdAt)}</span>
                          </div>
                          <p className="text-gray-800 text-sm mt-0.5">{reply.content}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <button
                              onClick={() => handleLikeComment(reply.id)}
                              className="flex items-center gap-1 text-gray-500 hover:text-red-500"
                            >
                              <Heart className={`w-3 h-3 ${reply.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                              {reply.likeCount > 0 && <span className="text-xs">{reply.likeCount}</span>}
                            </button>
                            {reply.userId === currentUserId && (
                              <button
                                onClick={() => handleDeleteComment(reply.id)}
                                className="text-gray-400 hover:text-red-500 text-xs"
                              >
                                删除
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;
