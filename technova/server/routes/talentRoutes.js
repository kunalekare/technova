import express from 'express';
import {
  getTalent,
  getTalentById,
  applyAsTalent,
  submitHiringRequest,
  getMyHires,
} from '../controllers/talentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getTalent);
router.get('/:id', getTalentById);

// Protected routes
router.use(protect);
router.post('/apply', applyAsTalent);
router.get('/my-hires', getMyHires);
router.post('/:id/hire', submitHiringRequest);

export default router;
