import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchTeamMembers = createAsyncThunk(
  'team/fetchTeamMembers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/team');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch team members');
    }
  }
);

export const addTeamMember = createAsyncThunk(
  'team/addTeamMember',
  async (memberData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/team', memberData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add team member');
    }
  }
);

export const updateTeamMember = createAsyncThunk(
  'team/updateTeamMember',
  async ({ id, memberData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/team/${id}`, memberData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update team member');
    }
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    members: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTeamError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => { state.loading = true; })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => { state.loading = false; state.members = action.payload; })
      .addCase(fetchTeamMembers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      .addCase(addTeamMember.pending, (state) => { state.loading = true; })
      .addCase(addTeamMember.fulfilled, (state, action) => { state.loading = false; state.members.push(action.payload); })
      .addCase(addTeamMember.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateTeamMember.pending, (state) => { state.loading = true; })
      .addCase(updateTeamMember.fulfilled, (state, action) => { 
        state.loading = false; 
        const index = state.members.findIndex(m => m._id === action.payload._id);
        if (index !== -1) state.members[index] = action.payload;
      })
      .addCase(updateTeamMember.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearTeamError } = teamSlice.actions;
export default teamSlice.reducer;
