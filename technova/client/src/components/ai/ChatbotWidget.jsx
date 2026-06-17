import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiPaperAirplane } from 'react-icons/hi';
import { FaRobot } from 'react-icons/fa';
import { toggleChat, addLocalMessage } from '../../redux/slices/aiSlice';
import { knowledgeBase, fallbackResponse } from '../../data/chatbotData';

const getBotResponse = (input) => {
  const lowerInput = input.toLowerCase();
  
  for (const entry of knowledgeBase) {
    if (entry.keywords.some(kw => lowerInput.includes(kw))) {
      return entry.response;
    }
  }
  
  return fallbackResponse;
};

const ChatbotWidget = () => {
  const dispatch = useDispatch();
  const { isChatOpen, chatHistory } = useSelector((state) => state.ai || { isChatOpen: false, chatHistory: [] });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatOpen, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput('');
    
    // 1. Add user message
    dispatch(addLocalMessage({ role: 'user', content: userText }));
    
    // 2. Simulate AI typing delay
    setIsTyping(true);
    
    setTimeout(() => {
      // 3. Generate and add bot response
      const responseText = getBotResponse(userText);
      dispatch(addLocalMessage({ role: 'assistant', content: responseText }));
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5s - 2.5s for realism
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => dispatch(toggleChat())}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-400 hover:to-accent-400 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(108,92,231,0.4)] hover:shadow-[0_0_30px_rgba(108,92,231,0.6)] transition-all hover:scale-110"
      >
        {isChatOpen ? <HiX className="w-6 h-6" /> : <FaRobot className="w-7 h-7" />}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-96 h-[500px] max-h-[calc(100vh-120px)] glass-card flex flex-col overflow-hidden shadow-2xl shadow-primary-900/40 border border-white/10"
          >
            {/* Premium Header */}
            <div className="bg-surface-900 border-b border-white/10 p-4 flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-accent-600/20 mix-blend-screen pointer-events-none" />
              <div className="flex items-center gap-3 text-white z-10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg border border-white/20">
                   <FaRobot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-md leading-tight">Nova Bot</h3>
                  <p className="text-xs text-primary-400 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" /> Online
                  </p>
                </div>
              </div>
              <button onClick={() => dispatch(toggleChat())} className="w-8 h-8 rounded-full bg-surface-800 flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-700 transition-colors z-10">
                <HiX className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-surface-950">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center border border-white/20 mr-2 flex-shrink-0 mt-auto">
                        <FaRobot className="w-4 h-4 text-white" />
                     </div>
                  )}
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[0.9rem] leading-relaxed shadow-lg whitespace-pre-wrap ${msg.role === 'user'
                      ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-br-sm'
                      : 'bg-surface-800 text-surface-200 border border-white/5 rounded-bl-sm'
                    }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start items-end">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center border border-white/20 mr-2 flex-shrink-0">
                      <FaRobot className="w-4 h-4 text-white" />
                   </div>
                  <div className="bg-surface-800 rounded-2xl rounded-bl-sm px-4 py-3 border border-white/5 flex items-center gap-1.5 h-11">
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-surface-900 border-t border-white/5">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-surface-950 border border-white/10 rounded-full pl-5 pr-14 py-3 text-sm text-white focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-inner"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-1.5 w-9 h-9 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all shadow-md"
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
