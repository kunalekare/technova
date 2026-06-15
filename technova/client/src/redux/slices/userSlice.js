import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchWishlist = createAsyncThunk(
  'user/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users/wishlist');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'user/toggleWishlist',
  async (serviceId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/users/wishlist/${serviceId}`);
      return { serviceId, isSaved: data.isSaved, message: data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update wishlist');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/users/profile', profileData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    wishlist: [],
    loading: false,
    error: null,
    updateSuccess: false,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    resetUpdateSuccess: (state) => {
      state.updateSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Wishlist
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        if (action.payload.isSaved) {
          // In a real app we might want to fetch the full service object,
          // but for now we'll just refetch if needed or handle locally.
        } else {
          state.wishlist = state.wishlist.filter(s => s._id !== action.payload.serviceId);
        }
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.updateSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false;
        state.updateSuccess = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError, resetUpdateSuccess } = userSlice.actions;
export default userSlice.reducer;
