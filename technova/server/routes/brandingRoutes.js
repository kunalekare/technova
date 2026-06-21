import express from 'express';
import { getMyBranding, updateMyBranding } from '../controllers/brandingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/')
  .get(getMyBranding)
  .post(updateMyBranding);

export default router;
