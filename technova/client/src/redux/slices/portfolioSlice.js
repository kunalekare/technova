import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAdminPortfolios = createAsyncThunk(
  'portfolio/fetchAdminPortfolios',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/portfolio/admin/all');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch portfolio items');
    }
  }
);

export const createPortfolio = createAsyncThunk(
  'portfolio/createPortfolio',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/portfolio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create portfolio item');
    }
  }
);

export const updatePortfolio = createAsyncThunk(
  'portfolio/updatePortfolio',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/portfolio/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update portfolio item');
    }
  }
);

export const deletePortfolio = createAsyncThunk(
  'portfolio/deletePortfolio',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/portfolio/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete portfolio item');
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearPortfolioError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminPortfolios.pending, (state) => { state.loading = true; })
      .addCase(fetchAdminPortfolios.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchAdminPortfolios.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      .addCase(createPortfolio.pending, (state) => { state.loading = true; })
      .addCase(createPortfolio.fulfilled, (state, action) => { state.loading = false; state.items.unshift(action.payload); })
      .addCase(createPortfolio.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updatePortfolio.pending, (state) => { state.loading = true; })
      .addCase(updatePortfolio.fulfilled, (state, action) => { 
        state.loading = false; 
        const index = state.items.findIndex(i => i._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updatePortfolio.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(deletePortfolio.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i._id !== action.payload);
      });
  },
});

export const { clearPortfolioError } = portfolioSlice.actions;
export default portfolioSlice.reducer;
