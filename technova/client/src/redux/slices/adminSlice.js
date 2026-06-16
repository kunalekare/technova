import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/dashboard');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin stats');
    }
  }
);

export const communicateWithLead = createAsyncThunk(
  'admin/communicateWithLead',
  async ({ leadId, type, message }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/leads/${leadId}/communicate`, { type, message });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to communicate with lead');
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/users');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchAllLeads = createAsyncThunk(
  'admin/fetchLeads',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/leads');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leads');
    }
  }
);

export const updateLeadStatus = createAsyncThunk(
  'admin/updateLeadStatus',
  async ({ leadId, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/leads/${leadId}/status`, { status });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update lead');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'admin/updateUser',
  async ({ userId, updateData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}`, updateData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const fetchPendingReviews = createAsyncThunk(
  'admin/fetchReviews',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/reviews/pending');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const moderateReview = createAsyncThunk(
  'admin/moderateReview',
  async ({ reviewId, action }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/reviews/${reviewId}`, { action });
      return { reviewId, action, data: data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to moderate review');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    users: [],
    leads: [],
    pendingReviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => { state.loading = false; state.stats = action.payload; })
      .addCase(fetchDashboardStats.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Users
      .addCase(fetchAllUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
      .addCase(fetchAllUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Update User
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) state.users[index] = action.payload;
      })

      // Leads
      .addCase(fetchAllLeads.pending, (state) => { state.loading = true; })
      .addCase(fetchAllLeads.fulfilled, (state, action) => { state.loading = false; state.leads = action.payload; })
      .addCase(fetchAllLeads.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Update Lead Status
      .addCase(updateLeadStatus.fulfilled, (state, action) => {
        const index = state.leads.findIndex((l) => l._id === action.payload._id);
        if (index !== -1) state.leads[index] = action.payload;
      })

      // Reviews
      .addCase(fetchPendingReviews.pending, (state) => { state.loading = true; })
      .addCase(fetchPendingReviews.fulfilled, (state, action) => { state.loading = false; state.pendingReviews = action.payload; })
      .addCase(fetchPendingReviews.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Moderate Review
      .addCase(moderateReview.fulfilled, (state, action) => {
        state.pendingReviews = state.pendingReviews.filter(r => r._id !== action.payload.reviewId);
      })
      
      // Communicate with Lead
      .addCase(communicateWithLead.fulfilled, (state, action) => {
        const index = state.leads.findIndex(l => l._id === action.payload._id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
