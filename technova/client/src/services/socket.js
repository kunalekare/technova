import { io } from 'socket.io-client';

let socket;

export const initiateSocketConnection = (token) => {
  if (socket) return; // Prevent multiple connections

  socket = io(import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000', {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'], // Use WebSocket first
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinProjectRoom = (projectId) => {
  if (socket) {
    socket.emit('joinProject', projectId);
  }
};

export const sendProjectMessage = (projectId, content, attachments = []) => {
  if (socket) {
    socket.emit('sendMessage', { projectId, content, attachments });
  }
};

export const sendTypingIndicator = (projectId, isTyping) => {
  if (socket) {
    socket.emit(isTyping ? 'typing' : 'stopTyping', { projectId });
  }
};

export const getSocket = () => {
  return socket;
};
