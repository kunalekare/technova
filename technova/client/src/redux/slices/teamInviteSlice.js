import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchSentInvites = createAsyncThunk(
  'teamInvites/fetchSent',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/team-invites');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch invites');
    }
  }
);

export const sendTeamInvite = createAsyncThunk(
  'teamInvites/send',
  async (inviteData, thunkAPI) => {
    try {
      const response = await api.post('/team-invites', inviteData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to send invite');
    }
  }
);

export const revokeTeamInvite = createAsyncThunk(
  'teamInvites/revoke',
  async (id, thunkAPI) => {
    try {
      const response = await api.post(`/team-invites/${id}/revoke`, {});
      return id; // Return the ID to remove it from state
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to revoke invite');
    }
  }
);

const initialState = {
  invites: [],
  loading: false,
  error: null,
  inviteSuccess: false,
};

const teamInviteSlice = createSlice({
  name: 'teamInvites',
  initialState,
  reducers: {
    resetInviteSuccess: (state) => {
      state.inviteSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSentInvites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSentInvites.fulfilled, (state, action) => {
        state.loading = false;
        state.invites = action.payload;
      })
      .addCase(fetchSentInvites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendTeamInvite.pending, (state) => {
        state.loading = true;
        state.inviteSuccess = false;
      })
      .addCase(sendTeamInvite.fulfilled, (state, action) => {
        state.loading = false;
        state.invites.push(action.payload);
        state.inviteSuccess = true;
      })
      .addCase(sendTeamInvite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(revokeTeamInvite.fulfilled, (state, action) => {
        const id = action.payload;
        const invite = state.invites.find(i => i._id === id);
        if (invite) {
          invite.status = 'revoked';
        }
      });
  },
});

export const { resetInviteSuccess } = teamInviteSlice.actions;
export default teamInviteSlice.reducer;
