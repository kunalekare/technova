import express from 'express';
import { createTicket, getMyTickets, getTicketById, addTicketMessage, getAllTickets } from '../controllers/ticketController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.route('/all')
  .get(authorize('admin', 'super_admin'), getAllTickets);

router.route('/')
  .post(upload.array('attachments', 5), createTicket)
  .get(getMyTickets);

router.route('/:id')
  .get(getTicketById);

router.route('/:id/messages')
  .post(upload.array('attachments', 5), addTicketMessage);

export default router;
