import express from 'express';
import { updateProfile, getWishlist, toggleWishlist } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.route('/profile')
  .put(upload.single('avatar'), updateProfile);

router.route('/wishlist')
  .get(getWishlist);

router.route('/wishlist/:serviceId')
  .post(toggleWishlist);

export default router;
