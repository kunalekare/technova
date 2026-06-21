import express from 'express';
import { createProject, getMyProjects, getProjectById, sendProjectProposal, updateProjectAdmin, scheduleMeeting, summarizeProjectMeeting, matchPartnersForProject } from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('client'), upload.array('files', 5), createProject)
  .get(getMyProjects);

router.route('/:id/proposal')
  .put(authorize('admin', 'super_admin'), sendProjectProposal);

router.route('/:id/admin')
  .put(authorize('admin', 'super_admin'), updateProjectAdmin);

router.route('/:id/match-partners')
  .get(authorize('admin', 'super_admin'), matchPartnersForProject);

router.route('/:id')
  .get(getProjectById);

router.route('/:id/meetings')
  .post(scheduleMeeting);

router.route('/:id/meetings/:meetingId/summarize')
  .post(authorize('admin', 'super_admin'), upload.single('audio'), summarizeProjectMeeting);

export default router;
