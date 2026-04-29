import { Heart, MessageCircle } from 'lucide-react';

const MatchPopup = ({ matchedUser, onStartChat, onKeepSwiping }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-bounce-in">
        {/* Header */}
        <div className="mb-6">
          <div className="text-5xl mb-4">💕</div>
          <h2 className="text-2xl font-bold text-gray-900">匹配成功!</h2>
          <p className="text-gray-500 mt-2">你们都互相喜欢对方</p>
        </div>

        {/* Avatars */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-200">
              <img
                src={matchedUser?.currentUserAvatar || 'https://via.placeholder.com/96'}
                alt="You"
                className="w-full h-full object-cover"
              />
            </div>
            <Heart className="absolute -top-2 -right-2 w-8 h-8 text-pink-500 fill-pink-100" />
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-200">
              <img
                src={matchedUser?.avatar || 'https://via.placeholder.com/96'}
                alt={matchedUser?.nickname}
                className="w-full h-full object-cover"
              />
            </div>
            <Heart className="absolute -top-2 -right-2 w-8 h-8 text-pink-500 fill-pink-100" />
          </div>
        </div>

        {/* User Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{matchedUser?.nickname}</h3>
          <p className="text-gray-500 text-sm">
            {matchedUser?.age}岁 · {matchedUser?.city}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onStartChat}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="w-5 h-5" />
            发送消息
          </button>
          <button
            onClick={onKeepSwiping}
            className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-full hover:bg-gray-200 transition-colors"
          >
            继续滑动
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchPopup;