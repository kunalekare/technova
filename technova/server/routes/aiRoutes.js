import express from 'express';
import { handleChat, generateScope, handleMeetingSummarize } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
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

export default router;
