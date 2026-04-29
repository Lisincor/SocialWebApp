import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';

const PostGrid = ({ posts = [] }) => {
  if (posts.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-4xl">📷</span>
        </div>
        <p className="text-gray-500">暂无帖子</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 p-1">
      {posts.map((post) => (
        <Link
          key={post.id}
          to={`/post/${post.id}`}
          className="aspect-square relative bg-gray-100 overflow-hidden"
        >
          <img
            src={post.mediaUrl || post.coverUrl}
            alt={post.content}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />

          {/* Overlay with stats */}
          <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <span className="flex items-center gap-1 text-white font-medium">
              <Heart className="w-5 h-5 fill-current" />
              {post.likeCount || 0}
            </span>
            <span className="flex items-center gap-1 text-white font-medium">
              <MessageCircle className="w-5 h-5" />
              {post.commentCount || 0}
            </span>
          </div>

          {/* Multiple media indicator */}
          {post.mediaType === 'multiple' && (
            <div className="absolute top-2 right-2">
              <div className="w-6 h-6 bg-white/80 rounded flex items-center justify-center">
                <span className="text-xs">⚡</span>
              </div>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
};

export default PostGrid;