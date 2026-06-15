import express from 'express';
import { createTicket, getMyTickets } from '../controllers/ticketController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createTicket)
  .get(getMyTickets);

export default router;
