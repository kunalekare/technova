import express from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

export default router;

export const adminCategoryRouter = express.Router();
adminCategoryRouter.use(protect, authorize('admin', 'super_admin'));
adminCategoryRouter.post('/', createCategory);
adminCategoryRouter.put('/:id', updateCategory);
adminCategoryRouter.delete('/:id', deleteCategory);
