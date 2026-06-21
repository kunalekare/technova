import express from 'express';
import { getProjectMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/:projectId', getProjectMessages);

export default router;
