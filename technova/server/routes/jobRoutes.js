import express from 'express';
import {
  getJobs,
  getJobById,
  applyToJob,
  getMyApplications,
  createJob,
  updateJob,
  deleteJob,
  getAllApplications,
  updateApplicationStatus,
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Protected user routes
router.post('/:id/apply', protect, applyToJob);
router.get('/my-applications', protect, getMyApplications); // Note: /my-applications is matched before /applications if we're not careful

// Admin routes
router.use(protect, authorize('admin', 'super_admin'));
router.get('/admin/applications', getAllApplications);
router.put('/admin/applications/:id/status', updateApplicationStatus);
router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
