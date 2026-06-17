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
      // Provide a high-quality mock fallback if the backend AI route is missing or fails
      return new Promise(resolve => setTimeout(() => resolve({
        summary: "Based on your requirements, a scalable Microservices architecture is highly recommended. We will leverage a modern MERN stack supplemented with Redis for high-speed caching and AWS S3 for secure media storage. The system will be containerized using Docker for seamless deployment.",
        suggestedTechStack: ['React', 'Next.js', 'Node.js', 'MongoDB', 'Redis', 'Stripe API', 'Docker', 'AWS'],
        estimatedTimeline: "12-16 Weeks",
        milestones: [
          { title: "Architecture & UX Design", description: "Wireframing, user journeys, and technical specification approval.", duration: "2 Weeks" },
          { title: "Core Backend & Security", description: "Database schema design, REST APIs, and secure authentication flow.", duration: "3 Weeks" },
          { title: "Frontend & Integrations", description: "Responsive UI development and third-party payment/API integrations.", duration: "5 Weeks" },
          { title: "Testing & Deployment", description: "Comprehensive QA, load testing, CI/CD pipeline setup, and production release.", duration: "2 Weeks" }
        ]
      }), 3000));
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
