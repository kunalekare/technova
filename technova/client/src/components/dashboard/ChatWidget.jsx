import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { HiPaperAirplane } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

const ChatWidget = ({ projectId }) => {
  const { socket, connected } = useSocket();
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (socket && connected && projectId) {
      // Join project room
      socket.emit('joinProject', projectId);

      // Listen for incoming messages
      socket.on('receiveMessage', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [socket, connected, projectId]);

  useEffect(() => {
    // Scroll to bottom when new message arrives
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !socket || !connected) return;

    socket.emit('sendMessage', {
      projectId,
      content: inputValue,
    });

    setInputValue('');
  };

  return (
    <div className="flex flex-col h-[500px] glass-card overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-white/5 bg-surface-950/50">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          Project Chat
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
        </h3>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-surface-400 text-sm text-center">
            Send a message to start the conversation with the team.
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender._id === user?._id;
            return (
              <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  isMe 
                    ? 'bg-primary-600 text-white rounded-br-sm' 
                    : 'bg-surface-800 text-surface-200 rounded-bl-sm border border-white/5'
                }`}>
                  {!isMe && <p className="text-xs text-primary-400 mb-1 font-medium">{msg.sender.name}</p>}
                  <p className="text-sm">{msg.content}</p>
                </div>
                <span className="text-[10px] text-surface-500 mt-1 px-1">
                  {format(new Date(msg.createdAt), 'h:mm a')}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-white/5 bg-surface-950/50">
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="input-field pr-12 w-full"
            disabled={!connected}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || !connected}
            className="absolute right-2 p-2 text-primary-400 hover:text-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <HiPaperAirplane className="w-5 h-5 rotate-90" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;
