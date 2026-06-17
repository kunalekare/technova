import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/notifications');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await api.put('/notifications/read-all');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        let fetchedItems = action.payload.data || [];
        
        // MOCK DATA INJECTION FOR DEMO IF EMPTY
        if (fetchedItems.length === 0) {
           fetchedItems = [
             { _id: 'mock1', type: 'info', title: 'System Updated', message: 'The TechNova platform has been updated to v2.0 with the latest UI improvements.', isRead: false, createdAt: new Date().toISOString() },
             { _id: 'mock2', type: 'success', title: 'Payment Received', message: 'Invoice #INV-2024 has been paid successfully. Thank you!', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
             { _id: 'mock3', type: 'ticket', title: 'New Support Ticket', message: 'A client has opened a new support request regarding their project.', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
             { _id: 'mock4', type: 'project', title: 'Project Milestone', message: 'The design phase for "Enterprise SaaS" has been completed.', isRead: true, createdAt: new Date(Date.now() - 172800000).toISOString() }
           ];
           state.unreadCount = 2;
        } else {
           state.unreadCount = action.payload.unreadCount || 0;
        }
        
        state.items = fetchedItems;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.items.find(n => n._id === action.payload);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.items.forEach(n => { n.isRead = true; });
        state.unreadCount = 0;
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
