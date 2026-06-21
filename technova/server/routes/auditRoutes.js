import express from 'express';
import { getAuditLogs } from '../controllers/auditController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'super_admin')); // Strictly admin only

router.route('/')
  .get(getAuditLogs);

export default router;
