import express from 'express';
import {
  getTeamMembers,
  addTeamMember,
  updateTeamMember
} from '../controllers/teamController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.route('/')
  .get(getTeamMembers)
  .post(addTeamMember);

router.route('/:id')
  .put(updateTeamMember);

export default router;
