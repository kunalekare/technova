import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMyVerification = createAsyncThunk(
  'verification/fetchMyVerification',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/verifications/me');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch verification');
    }
  }
);

export const submitVerification = createAsyncThunk(
  'verification/submitVerification',
  async (verificationData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/verifications', verificationData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit verification');
    }
  }
);

export const fetchAllVerifications = createAsyncThunk(
  'verification/fetchAllVerifications',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/verifications');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all verifications');
    }
  }
);

export const updateVerificationStatus = createAsyncThunk(
  'verification/updateVerificationStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/verifications/${id}/status`, { status });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update verification status');
    }
  }
);

const verificationSlice = createSlice({
  name: 'verification',
  initialState: {
    verifications: [],
    myVerification: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearVerificationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyVerification.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyVerification.fulfilled, (state, action) => { state.loading = false; state.myVerification = action.payload; })
      .addCase(fetchMyVerification.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      .addCase(submitVerification.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(submitVerification.fulfilled, (state, action) => { state.loading = false; state.myVerification = action.payload; })
      .addCase(submitVerification.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchAllVerifications.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllVerifications.fulfilled, (state, action) => { state.loading = false; state.verifications = action.payload; })
      .addCase(fetchAllVerifications.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateVerificationStatus.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateVerificationStatus.fulfilled, (state, action) => { 
        state.loading = false; 
        const index = state.verifications.findIndex(v => v._id === action.payload._id);
        if (index !== -1) state.verifications[index] = action.payload;
      })
      .addCase(updateVerificationStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearVerificationError } = verificationSlice.actions;
export default verificationSlice.reducer;
