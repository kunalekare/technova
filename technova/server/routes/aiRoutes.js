import express from 'express';
import { handleChat, generateScope } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public chat route
router.post('/chat', handleChat);

// Protected scoping route
router.post('/scope', protect, generateScope);

export default router;
