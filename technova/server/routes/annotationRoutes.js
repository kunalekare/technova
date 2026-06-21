import express from 'express';
import { getAnnotationsByProject, addAnnotationComment, resolveAnnotationComment } from '../controllers/annotationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/:projectId', getAnnotationsByProject);
router.post('/:projectId', addAnnotationComment);
router.put('/:projectId/:commentId/resolve', resolveAnnotationComment);

export default router;
