import express from 'express';
import { getMySentInvites, sendInvite, revokeInvite } from '../controllers/teamInviteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMySentInvites)
  .post(sendInvite);

router.route('/:id/revoke')
  .post(revokeInvite);

export default router;
