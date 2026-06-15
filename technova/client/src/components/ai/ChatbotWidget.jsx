import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChatAlt2, HiX, HiPaperAirplane, HiSparkles } from 'react-icons/hi';
import { toggleChat, addLocalMessage, sendChatMessage } from '../../redux/slices/aiSlice';

const ChatbotWidget = () => {
  const dispatch = useDispatch();
  const { isChatOpen, chatHistory, loadingChat } = useSelector((state) => state.ai || { isChatOpen: false, chatHistory: [], loadingChat: false });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || loadingChat) return;

    const userMsg = { role: 'user', content: input.trim() };

    // Add locally to UI immediately
    dispatch(addLocalMessage(userMsg));

    // Send full history context to API
    const contextToSend = [...chatHistory, userMsg].map(({ role, content }) => ({ role, content }));
    dispatch(sendChatMessage(contextToSend));

    setInput('');
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => dispatch(toggleChat())}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-500 hover:bg-primary-400 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-primary-500/25 transition-all"
      >
        {isChatOpen ? <HiX className="w-6 h-6" /> : <HiSparkles className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] max-h-[calc(100vh-120px)] glass-card flex flex-col overflow-hidden shadow-2xl shadow-primary-900/20 border border-white/10"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <HiSparkles className="w-5 h-5" />
                <h3 className="font-semibold">Nova AI Assistant</h3>
              </div>
              <button onClick={() => dispatch(toggleChat())} className="text-white/80 hover:text-white">
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-950/50">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-sm'
                      : 'bg-surface-800 text-surface-200 border border-white/5 rounded-bl-sm'
                    }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loadingChat && (
                <div className="flex justify-start">
                  <div className="bg-surface-800 text-surface-400 rounded-2xl rounded-bl-sm px-4 py-2 text-sm border border-white/5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-surface-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-surface-900 border-t border-white/10">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Nova anything..."
                  className="w-full bg-surface-950 border border-white/10 rounded-full pl-4 pr-12 py-2 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
                  disabled={loadingChat}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loadingChat}
                  className="absolute right-1 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <HiPaperAirplane className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
