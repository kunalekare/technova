import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createProject = createAsyncThunk(
  'project/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/projects', projectData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);

export const fetchMyProjects = createAsyncThunk(
  'project/fetchMyProjects',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/projects');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'project/fetchProjectById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project details');
    }
  }
);

export const scheduleMeeting = createAsyncThunk(
  'project/scheduleMeeting',
  async ({ projectId, meetingData }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/projects/${projectId}/meetings`, meetingData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to schedule meeting');
    }
  }
);

export const summarizeProjectMeeting = createAsyncThunk(
  'project/summarizeProjectMeeting',
  async ({ projectId, meetingId, transcriptText }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/projects/${projectId}/meetings/${meetingId}/summarize`, { textTranscript: transcriptText });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to summarize meeting');
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
    createSuccess: false,
  },
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    },
    resetCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.createSuccess = false;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = true;
        state.projects.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Projects
      .addCase(fetchMyProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchMyProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Project By Id
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Schedule Meeting
      .addCase(scheduleMeeting.fulfilled, (state, action) => {
        state.currentProject = action.payload;
      })
      // Summarize Meeting
      .addCase(summarizeProjectMeeting.fulfilled, (state, action) => {
        state.currentProject = action.payload;
      });
  },
});

export const { clearProjectError, resetCreateSuccess, clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
