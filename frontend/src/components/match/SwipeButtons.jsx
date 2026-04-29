import { X, Sparkles, Heart } from 'lucide-react';

const SwipeButtons = ({ onPass, onSuperLike, onLike, disabled }) => {
  return (
    <div className="flex items-center justify-center gap-6 mt-8">
      {/* Pass Button */}
      <button
        onClick={onPass}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-gray-200 hover:border-gray-300 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <X className="w-7 h-7 text-gray-400" />
      </button>

      {/* Super Like Button */}
      <button
        onClick={onSuperLike}
        disabled={disabled}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles className="w-5 h-5 text-white" />
      </button>

      {/* Like Button */}
      <button
        onClick={onLike}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 shadow-lg flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Heart className="w-7 h-7 text-white fill-current" />
      </button>
    </div>
  );
};

export default SwipeButtons;