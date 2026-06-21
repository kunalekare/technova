import express from 'express';
import { createRetainer, getRetainers, getMyRetainers, updateRetainer } from '../controllers/retainerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/my', getMyRetainers);

router.route('/')
  .post(authorize('admin', 'super_admin'), createRetainer)
  .get(authorize('admin', 'super_admin'), getRetainers);

router.route('/:id')
  .put(authorize('admin', 'super_admin'), updateRetainer);

export default router;
