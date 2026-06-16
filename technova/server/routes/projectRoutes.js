import express from 'express';
import { createProject, getMyProjects, getProjectById, sendProjectProposal } from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('client'), upload.array('files', 5), createProject)
  .get(getMyProjects);

router.route('/:id/proposal')
  .put(authorize('admin', 'super_admin'), sendProjectProposal);

router.route('/:id')
  .get(getProjectById);

export default router;
