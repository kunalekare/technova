import express from 'express';
import { handleChat, generateScope, handleMeetingSummarize, generateProposal, chatWithClientAssistant } from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import multer from 'multer';

// Simple local storage for whisper audio uploads
const upload = multer({ dest: 'uploads/audio/' });

const router = express.Router();

// Public chat route
router.post('/chat', handleChat);

// Protected scoping route
router.post('/scope', protect, generateScope);

// Meeting summarization
router.post('/meetings/summarize', protect, upload.single('audio'), handleMeetingSummarize);

// AI Proposal generation (Admin/Staff only)
router.get('/generate-proposal/:requestId', protect, authorize('admin', 'staff', 'super_admin'), generateProposal);

// Client-Facing RAG Assistant
router.post('/client-assistant', protect, chatWithClientAssistant);

export default router;
