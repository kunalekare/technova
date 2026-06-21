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

// Protected routes (Admin)
const adminAuth = authorize('admin', 'super_admin');
router.post('/', protect, adminAuth, createInternship);
router.get('/admin/applications', protect, adminAuth, getAllApplications);
router.put('/admin/applications/:id/status', protect, adminAuth, updateApplicationStatus);

// Public routes
router.get('/', getInternships);
router.get('/:id', getInternshipById);

router.post('/:id/apply', protect, applyToInternship);
router.put('/:id', protect, adminAuth, updateInternship);
router.delete('/:id', protect, adminAuth, deleteInternship);



export default router;
