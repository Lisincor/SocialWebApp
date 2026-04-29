import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatStore } from '../../stores/chatStore';
import { useAuthStore } from '../../stores/authStore';
import Avatar from '../../components/common/Avatar';
import { ArrowLeft, MoreHorizontal, Send, Image, Smile, Phone, Video } from 'lucide-react';
import toast from 'react-hot-toast';

const ChatRoomPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { messages, fetchMessages, sendMessage, conversation, fetchConversation, markAsRead, isSending } = useChatStore();

  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      loadChat();
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChat = async () => {
    setIsLoading(true);
    try {
      await fetchConversation(conversationId);
      await fetchMessages(conversationId);
      await markAsRead(conversationId);
    } catch (error) {
      toast.error('获取聊天记录失败');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!messageText.trim()) return;

    try {
      await sendMessage(conversationId, messageText.trim());
      setMessageText('');
      scrollToBottom();
    } catch (error) {
      toast.error('发送消息失败');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const targetUser = conversation?.targetUser;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>

        <div className="flex items-center gap-3 flex-1">
          <Avatar src={targetUser?.avatar} name={targetUser?.nickname} size="medium" />
          <div>
            <h2 className="font-semibold text-gray-900">{targetUser?.nickname || '聊天'}</h2>
            {targetUser?.isOnline && (
              <p className="text-xs text-green-500">在线</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">加载中...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>暂无消息</p>
            <p className="text-sm">发送消息开始聊天吧</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === user?.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex items-end gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0">
            <Image className="w-6 h-6 text-gray-500" />
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="发送消息..."
              rows={1}
              className="w-full px-4 py-3 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 max-h-32"
              style={{ minHeight: '44px' }}
            />
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0">
            <Smile className="w-6 h-6 text-gray-500" />
          </button>

          <button
            onClick={handleSend}
            disabled={!messageText.trim() || isSending}
            className="p-3 bg-primary-500 rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] flex ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isOwn && (
          <Avatar
            src={message.senderAvatar}
            name={message.senderName}
            size="small"
            className="flex-shrink-0 mr-2"
          />
        )}

        <div className={`px-4 py-2 rounded-2xl ${
          isOwn
            ? 'bg-primary-500 text-white rounded-br-md'
            : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          <div className={`text-xs mt-1 ${isOwn ? 'text-white/70 text-right' : 'text-gray-400'}`}>
            {formatTime(message.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

const formatTime = (time) => {
  if (!time) return '';
  return new Date(time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
};

export default ChatRoomPage;