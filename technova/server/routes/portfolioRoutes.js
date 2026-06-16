import express from 'express';
import {
  getPortfolios,
  getPortfolioById,
  getAdminPortfolios,
  createPortfolio,
  updatePortfolio,
  deletePortfolio
} from '../controllers/portfolioController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getPortfolios);
router.get('/:id', getPortfolioById);

// Admin routes
router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.get('/admin/all', getAdminPortfolios);
router.post('/', upload.array('images', 5), createPortfolio);
router.put('/:id', upload.array('images', 5), updatePortfolio);
router.delete('/:id', deletePortfolio);

export default router;
