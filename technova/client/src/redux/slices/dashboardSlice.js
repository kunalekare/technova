import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/dashboard/stats');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    activities: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        
        let fetchedStats = action.payload.stats;
        let fetchedActivities = action.payload.activities;
        
        // MOCK DATA INJECTION FOR DEMONSTRATION IF EMPTY
        if (!fetchedStats || fetchedStats.totalProjects === 0) {
          fetchedStats = {
            activeProjects: 3,
            completedProjects: 12,
            totalProjects: 15,
            pendingOrders: 1,
            totalOrders: 16,
            openTickets: 2,
            unreadNotifications: 4,
            savedServices: 8
          };
          
          fetchedActivities = [
            { id: '1', type: 'project', title: 'E-Commerce Platform', description: 'Development phase started', date: new Date().toISOString(), status: 'in_progress', link: '/dashboard/projects/1' },
            { id: '2', type: 'order', title: 'Invoice #INV-2024', description: 'Payment of $4,500 received', date: new Date(Date.now() - 86400000).toISOString(), status: 'paid', link: '/dashboard/orders/2' },
            { id: '3', type: 'ticket', title: 'API Integration Issue', description: 'TechNova support replied', date: new Date(Date.now() - 172800000).toISOString(), status: 'open', link: '/dashboard/tickets/3' },
            { id: '4', type: 'project', title: 'Mobile App Design', description: 'Project marked as completed', date: new Date(Date.now() - 345600000).toISOString(), status: 'completed', link: '/dashboard/projects/4' },
          ];
        }

        state.stats = fetchedStats;
        state.activities = fetchedActivities;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
