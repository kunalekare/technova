import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAdminBlogs = createAsyncThunk(
  'blog/fetchAdminBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/blogs/admin/all');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blogs');
    }
  }
);

export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create blog');
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blog/updateBlog',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/blogs/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update blog');
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blog/deleteBlog',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/blogs/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete blog');
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    blogs: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBlogError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminBlogs.pending, (state) => { state.loading = true; })
      .addCase(fetchAdminBlogs.fulfilled, (state, action) => { state.loading = false; state.blogs = action.payload; })
      .addCase(fetchAdminBlogs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      .addCase(createBlog.pending, (state) => { state.loading = true; })
      .addCase(createBlog.fulfilled, (state, action) => { state.loading = false; state.blogs.unshift(action.payload); })
      .addCase(createBlog.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateBlog.pending, (state) => { state.loading = true; })
      .addCase(updateBlog.fulfilled, (state, action) => { 
        state.loading = false; 
        const index = state.blogs.findIndex(b => b._id === action.payload._id);
        if (index !== -1) state.blogs[index] = action.payload;
      })
      .addCase(updateBlog.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter(b => b._id !== action.payload);
      });
  },
});

export const { clearBlogError } = blogSlice.actions;
export default blogSlice.reducer;
