import express from 'express';
import { getDashboardStats, getAllUsers, getAllProjects } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/projects', getAllProjects);

export default router;
