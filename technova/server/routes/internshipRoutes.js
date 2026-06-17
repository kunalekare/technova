import express from 'express';
import {
  getInternships,
  getInternshipById,
  applyToInternship,
  getMyApplications,
  createInternship,
  updateInternship,
  deleteInternship,
  getAllApplications,
  updateApplicationStatus,
} from '../controllers/internshipController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected user routes
router.get('/my-applications', protect, getMyApplications); 

// Public routes
router.get('/', getInternships);
router.get('/:id', getInternshipById);

router.post('/:id/apply', protect, applyToInternship);

// Protected routes (Admin)
const adminAuth = authorize('admin', 'super_admin');
router.post('/', adminAuth, createInternship);
router.put('/:id', adminAuth, updateInternship);
router.delete('/:id', adminAuth, deleteInternship);
router.get('/admin/applications', adminAuth, getAllApplications);
router.put('/admin/applications/:id/status', adminAuth, updateApplicationStatus);

export default router;
