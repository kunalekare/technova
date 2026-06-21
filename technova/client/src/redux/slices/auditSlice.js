import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAuditLogs = createAsyncThunk(
  'audit/fetchAuditLogs',
  async ({ page = 1, limit = 50, action, targetType } = {}, { rejectWithValue }) => {
    try {
      let query = `?page=${page}&limit=${limit}`;
      if (action) query += `&action=${action}`;
      if (targetType) query += `&targetType=${targetType}`;

      const { data } = await api.get(`/audit-logs${query}`);
      return data; // Returns the whole payload including pagination
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch audit logs');
    }
  }
);

const auditSlice = createSlice({
  name: 'audit',
  initialState: {
    logs: [],
    pagination: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearAuditError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => { 
        state.loading = false; 
        state.logs = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearAuditError } = auditSlice.actions;
export default auditSlice.reducer;
