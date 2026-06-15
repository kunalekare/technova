import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const sendChatMessage = createAsyncThunk(
  'ai/sendChatMessage',
  async (messages, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/ai/chat', { messages });
      return data.data; // { role: 'assistant', content: '...' }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get response');
    }
  }
);

export const generateScope = createAsyncThunk(
  'ai/generateScope',
  async (description, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/ai/scope', { description });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate scope');
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    chatHistory: [
      { role: 'assistant', content: 'Hello! I am Nova, your AI consultant. How can I help you today?' }
    ],
    isChatOpen: false,
    projectScope: null,
    loadingChat: false,
    loadingScope: false,
    error: null,
  },
  reducers: {
    toggleChat: (state) => {
      state.isChatOpen = !state.isChatOpen;
    },
    addLocalMessage: (state, action) => {
      state.chatHistory.push(action.payload);
    },
    clearAiError: (state) => {
      state.error = null;
    },
    resetScope: (state) => {
      state.projectScope = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Chat
      .addCase(sendChatMessage.pending, (state) => {
        state.loadingChat = true;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loadingChat = false;
        state.chatHistory.push(action.payload);
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loadingChat = false;
        state.error = action.payload;
        // Optionally add a system error message
        state.chatHistory.push({ role: 'assistant', content: 'Sorry, I am having trouble connecting right now.' });
      })
      // Scope
      .addCase(generateScope.pending, (state) => {
        state.loadingScope = true;
      })
      .addCase(generateScope.fulfilled, (state, action) => {
        state.loadingScope = false;
        state.projectScope = action.payload;
      })
      .addCase(generateScope.rejected, (state, action) => {
        state.loadingScope = false;
        state.error = action.payload;
      });
  },
});

export const { toggleChat, addLocalMessage, clearAiError, resetScope } = aiSlice.actions;
export default aiSlice.reducer;
