import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { HiPaperAirplane, HiPhotograph, HiPaperClip, HiX } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

const ChatWidget = ({ projectId }) => {
  const { socket, connected } = useSocket();
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [typing, setTyping] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (socket && connected && projectId) {
      // Join project room
      socket.emit('joinProject', projectId);

      // Listen for incoming messages
      socket.on('receiveMessage', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      // Typing indicators
      socket.on('userTyping', ({ name }) => {
        setTyping(name);
      });

      socket.on('userStopTyping', () => {
        setTyping(null);
      });

      return () => {
        socket.off('receiveMessage');
        socket.off('userTyping');
        socket.off('userStopTyping');
      };
    }
  }, [socket, connected, projectId]);

  useEffect(() => {
    // Scroll to bottom when new message arrives
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = () => {
    if (socket && connected) {
      socket.emit('typing', { projectId });
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socket.emit('stopTyping', { projectId });
      }, 2000);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !socket || !connected) return;

    socket.emit('sendMessage', {
      projectId,
      content: inputValue,
      attachments: attachments.map(a => a.name),
    });

    socket.emit('stopTyping', { projectId });
    setInputValue('');
    setAttachments([]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files].slice(0, 5));
  };

  return (
    <div className="flex flex-col h-[500px] glass-card overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-white/5 bg-surface-950/50 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          Project Chat
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
        </h3>
        <span className="text-xs text-surface-500">
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-surface-400 text-sm text-center flex-col gap-2">
            <div className="w-16 h-16 rounded-2xl bg-surface-800/50 flex items-center justify-center mb-2">
              <HiPaperAirplane className="w-8 h-8 text-surface-600 rotate-90" />
            </div>
            <p className="font-medium">No messages yet</p>
            <p className="text-xs text-surface-500">Send a message to start the conversation with the team.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender._id === user?._id;
            return (
              <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  isMe 
                    ? 'bg-primary-600 text-white rounded-br-sm' 
                    : 'bg-surface-800 text-surface-200 rounded-bl-sm border border-white/5'
                }`}>
                  {!isMe && <p className="text-xs text-primary-400 mb-1 font-medium">{msg.sender.name}</p>}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  {msg.attachments?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.attachments.map((att, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/20 text-[10px]">
                          <HiPaperClip className="w-3 h-3" /> {att}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-surface-500 mt-1 px-1">
                  {format(new Date(msg.createdAt), 'h:mm a')}
                </span>
              </div>
            );
          })
        )}
        {typing && (
          <div className="flex items-center gap-2 text-xs text-surface-400">
            <div className="flex gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            {typing} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t border-white/5 bg-surface-950/30">
          <div className="flex items-center gap-2 flex-wrap">
            {attachments.map((file, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-800/50 text-xs text-surface-300">
                <HiPaperClip className="w-3 h-3 text-surface-400" />
                {file.name}
                <button onClick={() => setAttachments(prev => prev.filter((_, fi) => fi !== i))} className="text-surface-500 hover:text-red-400 ml-0.5">
                  <HiX className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="p-4 border-t border-white/5 bg-surface-950/50">
        <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
          <label className="p-2 text-surface-400 hover:text-primary-400 cursor-pointer transition-colors flex-shrink-0">
            <HiPhotograph className="w-5 h-5" />
            <input type="file" multiple className="hidden" accept="image/*,.pdf,.doc,.docx,.zip" onChange={handleFileSelect} />
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value); handleTyping(); }}
            placeholder="Type your message..."
            className="input-field pr-12 w-full !py-2.5"
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
