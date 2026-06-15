import express from 'express';
import passport from 'passport';
import {
  register,
  login,
  refreshAccessToken,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  googleCallback,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
      console.log('==== PASSPORT GOOGLE AUTHENTICATE ====');
      console.log('Error:', err);
      console.log('User:', user);
      console.log('Info:', info);
      
      if (err) {
        console.error('Passport Strategy Error:', err);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=${encodeURIComponent(err.message || 'unknown_error')}`);
      }
      if (!user) {
        console.error('No User returned from Passport Strategy');
        return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user`);
      }
      
      req.user = user;
      next();
    })(req, res, next);
  },
  googleCallback
);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
