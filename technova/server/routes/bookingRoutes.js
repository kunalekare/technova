import express from 'express';
import { createBooking, getMyBookings, getAllBookings } from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/', authorize('admin', 'staff', 'super_admin'), getAllBookings);

export default router;
