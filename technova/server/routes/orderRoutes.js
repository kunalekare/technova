import express from 'express';
import { placeOrder, getMyOrders, getOrderById, getAllOrders } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(placeOrder)
  .get(authorize('admin', 'super_admin'), getAllOrders);

router.route('/myorders')
  .get(getMyOrders);

router.route('/:id')
  .get(getOrderById);

export default router;
