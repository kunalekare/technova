import { useLocation } from 'react-router-dom';
import ChatbotWidget from './ChatbotWidget';

const GlobalChatbot = () => {
  const location = useLocation();
  const path = location.pathname;

  // Do not show the public ChatbotWidget on authenticated dashboard routes
  // since they have their own specialized assistants (like ClientAssistant)
  if (path.startsWith('/dashboard') || path.startsWith('/admin') || path.startsWith('/partner-portal')) {
    return null;
  }

  return <ChatbotWidget />;
};

export default GlobalChatbot;
