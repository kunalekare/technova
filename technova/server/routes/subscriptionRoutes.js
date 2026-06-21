import express from 'express';
import {
  startSubscription,
  getMySubscriptions,
  cancelSubscription,
} from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', startSubscription);
router.get('/my-subscriptions', getMySubscriptions);
router.put('/:id/cancel', cancelSubscription);

export default router;
