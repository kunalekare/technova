import express from 'express';
import { getMyReferrals, createReferral } from '../controllers/referralController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/my', getMyReferrals);
router.post('/', createReferral);

export default router;
