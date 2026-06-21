import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Get user's branding (either their own, or their parent account's)
export const fetchBranding = createAsyncThunk(
  'branding/fetch',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/branding');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch branding');
    }
  }
);

// Update/Create branding
export const updateBranding = createAsyncThunk(
  'branding/update',
  async (brandingData, thunkAPI) => {
    try {
      const response = await api.post('/branding', brandingData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update branding');
    }
  }
);

const initialState = {
  branding: null,
  loading: false,
  error: null,
  updateSuccess: false,
};

const brandingSlice = createSlice({
  name: 'branding',
  initialState,
  reducers: {
    resetBrandingState: (state) => {
      state.updateSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranding.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBranding.fulfilled, (state, action) => {
        state.loading = false;
        state.branding = action.payload; // Will be null if no branding
      })
      .addCase(fetchBranding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBranding.pending, (state) => {
        state.loading = true;
        state.updateSuccess = false;
      })
      .addCase(updateBranding.fulfilled, (state, action) => {
        state.loading = false;
        state.branding = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateBranding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetBrandingState } = brandingSlice.actions;
export default brandingSlice.reducer;
