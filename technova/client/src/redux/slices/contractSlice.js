import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMyContracts = createAsyncThunk(
  'contract/fetchMyContracts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/contracts');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contracts');
    }
  }
);

export const fetchAllContracts = createAsyncThunk(
  'contract/fetchAllContracts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/contracts/all');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all contracts');
    }
  }
);

export const createAndSendContract = createAsyncThunk(
  'contract/createAndSendContract',
  async ({ projectId, clientId }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/contracts', { projectId, clientId });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send contract');
    }
  }
);

export const signContract = createAsyncThunk(
  'contract/signContract',
  async (contractId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/contracts/${contractId}/sign`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to sign contract');
    }
  }
);

const contractSlice = createSlice({
  name: 'contract',
  initialState: {
    contracts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearContractError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyContracts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyContracts.fulfilled, (state, action) => { state.loading = false; state.contracts = action.payload; })
      .addCase(fetchMyContracts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      .addCase(fetchAllContracts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllContracts.fulfilled, (state, action) => { state.loading = false; state.contracts = action.payload; })
      .addCase(fetchAllContracts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createAndSendContract.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createAndSendContract.fulfilled, (state, action) => { state.loading = false; state.contracts.unshift(action.payload); })
      .addCase(createAndSendContract.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(signContract.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signContract.fulfilled, (state, action) => { 
        state.loading = false; 
        const index = state.contracts.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.contracts[index] = action.payload;
      })
      .addCase(signContract.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearContractError } = contractSlice.actions;
export default contractSlice.reducer;
