import express from 'express';
import { 
  getMyVerification, 
  submitVerification, 
  getAllVerifications, 
  updateVerificationStatus 
} from '../controllers/verificationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { auditLogger } from '../middleware/auditLogger.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(submitVerification)
  .get(authorize('admin', 'super_admin'), getAllVerifications);

router.route('/me')
  .get(getMyVerification);

router.route('/:id/status')
  .put(
    authorize('admin', 'super_admin'), 
    auditLogger('BusinessVerification', 'UPDATE_VERIFICATION_STATUS'), 
    updateVerificationStatus
  );

export default router;
