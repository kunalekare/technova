import express from 'express';
import {
  getTeamMembers,
  addTeamMember,
  updateTeamMember
} from '../controllers/teamController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTeamMembers)
  .post(authorize('admin', 'super_admin'), addTeamMember);

router.route('/:id')
  .put(authorize('admin', 'super_admin'), updateTeamMember);

export default router;
