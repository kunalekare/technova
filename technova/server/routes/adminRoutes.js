import express from 'express';
import { getDashboardStats, getAllUsers, updateUser, getAllProjects, getPendingReviews, moderateReview, handleSuggestTeam, handleGetSentiments } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.get('/projects', getAllProjects);
router.get('/projects/:id/suggest-team', handleSuggestTeam);
router.get('/sentiments', handleGetSentiments);

// Review Moderation
router.get('/reviews/pending', getPendingReviews);
router.put('/reviews/:id', moderateReview);

export default router;
