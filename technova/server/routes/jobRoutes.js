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

// Protected user routes
router.get('/my-applications', protect, getMyApplications); 

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

router.post('/:id/apply', protect, applyToJob);

// Admin routes
router.use(protect, authorize('admin', 'super_admin'));
router.get('/admin/applications', getAllApplications);
router.put('/admin/applications/:id/status', updateApplicationStatus);
router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
