import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  fixCategories,
  getRatesPublic
} from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/rates', getRatesPublic);
router.get('/seed', fixCategories);
router.get('/', getServices);
router.get('/:id', getServiceById);

export default router;

// Admin routes (mounted under /api/v1/admin/services)
export const adminServiceRouter = express.Router();
adminServiceRouter.use(protect, authorize('admin', 'super_admin'));
adminServiceRouter.post('/', createService);
adminServiceRouter.put('/:id', updateService);
adminServiceRouter.delete('/:id', deleteService);
