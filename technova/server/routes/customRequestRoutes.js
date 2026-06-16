import express from 'express';
import {
  createCustomRequest,
  getCustomRequests,
  updateCustomRequestStatus,
} from '../controllers/customRequestController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for users to submit requests
router.post('/', createCustomRequest);

// Admin routes
router.use(protect, authorize('admin', 'super_admin'));
router.get('/', getCustomRequests);
router.put('/:id/status', updateCustomRequestStatus);

export default router;
