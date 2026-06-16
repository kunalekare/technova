import crypto from 'crypto';
import User from '../models/User.js';
import Role from '../models/Role.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/generateToken.js';
import logger from '../utils/logger.js';

// @desc    Register a new client
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Get client role
    let clientRole = await Role.findOne({ name: 'client' });
    if (!clientRole) {
      clientRole = await Role.create({
        name: 'client',
        permissions: ['view_services', 'create_projects', 'manage_profile'],
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: clientRole._id,
      isVerified: true, // TODO: Add email verification flow
      status: 'active',
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userResponse = await User.findById(user._id).populate('role');

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          _id: userResponse._id,
          name: userResponse.name,
          email: userResponse.email,
          avatar: userResponse.avatar,
          role: userResponse.role,
          isVerified: userResponse.isVerified,
        },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login with email/password
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email })
      .select('+password')
      .populate('role');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'This account uses Google login. Please sign in with Google.',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.',
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          isVerified: user.isVerified,
        },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh
// @access  Public (with refresh token cookie)
export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided',
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id).populate('role');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }
};

// @desc    Logout - clear refresh token
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current logged-in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('role')
      .populate('savedServices');

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password - send reset email
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    // TODO: Send email with reset link
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    logger.info(`Password reset URL: ${resetUrl}`);

    res.json({
      success: true,
      message: 'Password reset email sent',
      // In development, include the token for testing
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using token
// @route   POST /api/v1/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful. Please login with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Google OAuth callback handler
// @route   GET /api/v1/auth/google/callback
// @access  Public
export const googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect to frontend with access token
    res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`
    );
  } catch (error) {
    console.error('googleCallback Error:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
};

// @desc    Update Password
// @route   PUT /api/v1/auth/update-password
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    // If Google auth user with no password
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'You signed in with Google. You cannot change your password here.',
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new passwords',
      });
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
