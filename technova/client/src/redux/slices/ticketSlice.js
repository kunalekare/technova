import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createTicket = createAsyncThunk(
  'ticket/createTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/tickets', ticketData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create ticket');
    }
  }
);

export const fetchMyTickets = createAsyncThunk(
  'ticket/fetchMyTickets',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/tickets');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets');
    }
  }
);

export const fetchTicketById = createAsyncThunk(
  'ticket/fetchTicketById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/tickets/${id}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch ticket');
    }
  }
);

export const addTicketMessage = createAsyncThunk(
  'ticket/addTicketMessage',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/tickets/${id}/messages`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add message');
    }
  }
);

const ticketSlice = createSlice({
  name: 'ticket',
  initialState: {
    tickets: [],
    currentTicket: null,
    loading: false,
    error: null,
    createSuccess: false,
  },
  reducers: {
    clearTicketError: (state) => { state.error = null; },
    resetCreateSuccess: (state) => { state.createSuccess = false; },
    clearCurrentTicket: (state) => { state.currentTicket = null; },
  },
  extraReducers: (builder) => {
    builder
      // Create Ticket
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
        state.createSuccess = false;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = true;
        state.tickets.unshift(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Tickets
      .addCase(fetchMyTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Ticket By Id
      .addCase(fetchTicketById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTicket = action.payload;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Ticket Message
      .addCase(addTicketMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTicketMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTicket = action.payload;
        // Update in list too
        const idx = state.tickets.findIndex(t => t._id === action.payload._id);
        if (idx !== -1) state.tickets[idx] = action.payload;
      })
      .addCase(addTicketMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTicketError, resetCreateSuccess, clearCurrentTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
