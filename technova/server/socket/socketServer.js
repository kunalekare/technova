import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

let io;

export const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} (User: ${socket.user.name})`);

    // Join personal room for private notifications
    socket.join(socket.user._id.toString());

    // Allow user to join specific project rooms
    socket.on('joinProject', (projectId) => {
      socket.join(`project_${projectId}`);
      console.log(`User ${socket.user.name} joined project room: ${projectId}`);
    });

    // Handle project chat messages
    socket.on('sendMessage', async (data) => {
      const { projectId, content } = data;
      
      const message = {
        _id: new Date().getTime().toString(), // mock ID
        projectId,
        content,
        sender: {
          _id: socket.user._id,
          name: socket.user.name,
          avatar: socket.user.avatar,
        },
        createdAt: new Date(),
      };

      // Broadcast to everyone in the project room
      io.to(`project_${projectId}`).emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
