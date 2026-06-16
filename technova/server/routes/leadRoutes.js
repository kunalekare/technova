import express from 'express';
import { createLead, getLeads, updateLeadStatus, communicateWithLead } from '../controllers/leadController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for contact forms
router.post('/', createLead);

// Admin only routes for CRM
router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.get('/', getLeads);
router.put('/:id/status', updateLeadStatus);
router.post('/:id/communicate', communicateWithLead);

export default router;
