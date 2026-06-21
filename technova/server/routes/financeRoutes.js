import express from 'express';
import { getForecast, getProfitability } from '../controllers/financeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.get('/forecast', getForecast);
router.get('/profitability', getProfitability);

export default router;
