import express from 'express';
import { getForecast, getProfitability, getAdvancedBI } from '../controllers/financeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.get('/forecast', getForecast);
router.get('/profitability', getProfitability);
router.get('/advanced-bi', getAdvancedBI);

export default router;
