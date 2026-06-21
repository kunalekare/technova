import express from 'express';
import {
  getMyCommissions,
  getAllCommissions,
  markCommissionPaid
} from '../controllers/commissionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/my', getMyCommissions);

router.get('/', authorize('admin', 'super_admin'), getAllCommissions);
router.put('/:id/pay', authorize('admin', 'super_admin'), markCommissionPaid);

export default router;
