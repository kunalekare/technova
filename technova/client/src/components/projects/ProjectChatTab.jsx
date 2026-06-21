import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getSocket, sendProjectMessage, sendTypingIndicator } from '../../services/socket';
import api from '../../services/api';
import { format } from 'date-fns';
import { HiPaperAirplane } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ProjectChatTab = ({ project }) => {
  const { user } = useSelector(state => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Fetch historical messages
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${project._id}`);
        setMessages(res.data.data);
      } catch (err) {
        toast.error('Failed to load chat history');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();

    // Socket Event Listeners
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleUserTyping = ({ userId, name }) => {
      if (userId !== user._id) {
        setTypingUsers((prev) => {
          if (!prev.find(u => u.userId === userId)) return [...prev, { userId, name }];
          return prev;
        });
      }
    };

    const handleUserStopTyping = ({ userId }) => {
      setTypingUsers((prev) => prev.filter(u => u.userId !== userId));
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('userTyping', handleUserTyping);
    socket.on('userStopTyping', handleUserStopTyping);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('userTyping', handleUserTyping);
      socket.off('userStopTyping', handleUserStopTyping);
    };
  }, [project._id, user._id]);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const handleTextChange = (e) => {
    setNewMessage(e.target.value);

    // Typing indicator logic
    sendTypingIndicator(project._id, true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(project._id, false);
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    sendProjectMessage(project._id, newMessage);
    setNewMessage('');
    sendTypingIndicator(project._id, false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  if (loading) {
    return <div className="text-center py-10 text-surface-400">Loading chat history...</div>;
  }

  return (
    <div className="flex flex-col h-[600px] glass-card border border-white/5 rounded-2xl overflow-hidden">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-surface-900/50">
        {messages.length === 0 && (
          <div className="text-center text-surface-500 italic mt-10">No messages yet. Start the conversation!</div>
        )}
        
        {messages.map((msg, index) => {
          const isMe = msg.sender?._id === user._id;
          return (
            <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {msg.sender?.avatar ? (
                    <img src={msg.sender.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-white/10" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                      {msg.sender?.name?.substring(0, 2) || 'U'}
                    </div>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs text-surface-400 mb-1 ml-1">{msg.sender?.name}</span>
                  <div className={`px-4 py-2.5 rounded-2xl ${isMe ? 'bg-primary-600 text-white rounded-tr-sm' : 'bg-surface-800 text-white border border-white/5 rounded-tl-sm'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-surface-500 mt-1">{format(new Date(msg.createdAt), 'h:mm a')}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicators */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-surface-400 text-xs italic ml-10">
            <span className="flex gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </span>
            {typingUsers.map(u => u.name).join(', ')} is typing
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="p-4 bg-surface-900 border-t border-white/5">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleTextChange}
            placeholder="Type your message..."
            className="flex-1 bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl transition-all shadow-glow-primary flex items-center justify-center"
          >
            <HiPaperAirplane className="w-5 h-5 rotate-90" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectChatTab;
