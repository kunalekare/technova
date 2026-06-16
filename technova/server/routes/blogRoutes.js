import express from 'express';
import {
  getBlogs,
  getBlogBySlug,
  getAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);

// Admin routes
router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.get('/admin/all', getAdminBlogs);
router.post('/', upload.single('coverImage'), createBlog);
router.put('/:id', upload.single('coverImage'), updateBlog);
router.delete('/:id', deleteBlog);

export default router;
