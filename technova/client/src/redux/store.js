import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import serviceReducer from './slices/serviceSlice';
import notificationReducer from './slices/notificationSlice';
import userReducer from './slices/userSlice';
import projectReducer from './slices/projectSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice';
import aiReducer from './slices/aiSlice';
import ticketReducer from './slices/ticketSlice';
import dashboardReducer from './slices/dashboardSlice';
import blogReducer from './slices/blogSlice';
import portfolioReducer from './slices/portfolioSlice';
import teamReducer from './slices/teamSlice';
import contractReducer from './slices/contractSlice';
import escrowReducer from './slices/escrowSlice';
import verificationReducer from './slices/verificationSlice';
import auditReducer from './slices/auditSlice';
import brandingReducer from './slices/brandingSlice';
import teamInviteReducer from './slices/teamInviteSlice';

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
    ticket: ticketReducer,
    dashboard: dashboardReducer,
    blog: blogReducer,
    portfolio: portfolioReducer,
    team: teamReducer,
    contract: contractReducer,
    escrow: escrowReducer,
    verification: verificationReducer,
    audit: auditReducer,
    branding: brandingReducer,
    teamInvites: teamInviteReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
