import express from 'express';
import {
  applyForPartner,
  getMyPartnerProfile,
  getAllPartners,
  getAllApplications,
  updateApplicationStatus
} from '../controllers/partnerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/apply', applyForPartner);
router.get('/my', getMyPartnerProfile);

router.get('/', authorize('admin', 'super_admin'), getAllPartners);
router.get('/applications', authorize('admin', 'super_admin'), getAllApplications);
router.put('/applications/:id', authorize('admin', 'super_admin'), updateApplicationStatus);

export default router;
