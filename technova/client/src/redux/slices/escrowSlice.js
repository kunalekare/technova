import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMyEscrows = createAsyncThunk(
  'escrow/fetchMyEscrows',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/escrow/my-escrows');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch escrows');
    }
  }
);

export const fetchAllEscrows = createAsyncThunk(
  'escrow/fetchAllEscrows',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/escrow');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all escrows');
    }
  }
);

export const releaseEscrow = createAsyncThunk(
  'escrow/releaseEscrow',
  async (escrowId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/escrow/${escrowId}/release`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to release escrow funds');
    }
  }
);

export const disputeEscrow = createAsyncThunk(
  'escrow/disputeEscrow',
  async (escrowId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/escrow/${escrowId}/dispute`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to dispute escrow funds');
    }
  }
);

const escrowSlice = createSlice({
  name: 'escrow',
  initialState: {
    escrows: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearEscrowError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyEscrows.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyEscrows.fulfilled, (state, action) => { state.loading = false; state.escrows = action.payload; })
      .addCase(fetchMyEscrows.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      .addCase(fetchAllEscrows.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllEscrows.fulfilled, (state, action) => { state.loading = false; state.escrows = action.payload; })
      .addCase(fetchAllEscrows.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(releaseEscrow.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(releaseEscrow.fulfilled, (state, action) => { 
        state.loading = false; 
        const index = state.escrows.findIndex(e => e._id === action.payload._id);
        if (index !== -1) state.escrows[index] = action.payload;
      })
      .addCase(releaseEscrow.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(disputeEscrow.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(disputeEscrow.fulfilled, (state, action) => { 
        state.loading = false; 
        const index = state.escrows.findIndex(e => e._id === action.payload._id);
        if (index !== -1) state.escrows[index] = action.payload;
      })
      .addCase(disputeEscrow.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearEscrowError } = escrowSlice.actions;
export default escrowSlice.reducer;
