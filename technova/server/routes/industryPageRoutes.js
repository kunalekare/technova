import express from 'express';
import { getIndustryPages, getIndustryPageBySlug, createIndustryPage, updateIndustryPage, deleteIndustryPage } from '../controllers/industryPageController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getIndustryPages);
router.get('/:slug', getIndustryPageBySlug);

router.use(protect, authorize('admin', 'super_admin'));
router.post('/', createIndustryPage);
router.put('/:id', updateIndustryPage);
router.delete('/:id', deleteIndustryPage);

export default router;
