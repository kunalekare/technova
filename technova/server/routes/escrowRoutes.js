import express from 'express';
import { 
  getMyEscrows, 
  getAllEscrows, 
  releaseEscrowFunds, 
  disputeEscrowFunds 
} from '../controllers/escrowController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditLogger } from '../middleware/auditLogger.js';

const router = express.Router();

router.use(protect);

router.route('/my-escrows')
  .get(getMyEscrows);

router.route('/')
  .get(authorize('admin', 'super_admin'), getAllEscrows);

router.route('/:id/release')
  .post(
    authorize('admin', 'super_admin'), 
    auditLogger('EscrowTransaction', 'RELEASE_FUNDS'), 
    releaseEscrowFunds
  );

router.route('/:id/dispute')
  .post(disputeEscrowFunds);

export default router;
