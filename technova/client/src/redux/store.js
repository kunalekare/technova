import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import serviceReducer from './slices/serviceSlice';
import notificationReducer from './slices/notificationSlice';
import userReducer from './slices/userSlice';
import projectReducer from './slices/projectSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice';
import aiReducer from './slices/aiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
    notifications: notificationReducer,
    user: userReducer,
    project: projectReducer,
    order: orderReducer,
    admin: adminReducer,
    ai: aiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
