import User from '../models/User.js';
import Service from '../models/Service.js';

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      
      // Avatar upload handling (handled by upload middleware if implemented)
      if (req.file && req.file.path) {
        user.avatar = req.file.path;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          phone: updatedUser.phone,
          role: updatedUser.role,
        },
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user wishlist
// @route   GET /api/v1/users/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('savedServices');
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      data: user.savedServices,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle service in wishlist
// @route   POST /api/v1/users/wishlist/:serviceId
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    
    const service = await Service.findById(serviceId);
    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    const user = await User.findById(req.user._id);
    
    const isSaved = user.savedServices.includes(serviceId);
    
    if (isSaved) {
      // Remove from wishlist
      user.savedServices = user.savedServices.filter(
        (id) => id.toString() !== serviceId
      );
    } else {
      // Add to wishlist
      user.savedServices.push(serviceId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isSaved ? 'Removed from wishlist' : 'Added to wishlist',
      isSaved: !isSaved,
    });
  } catch (error) {
    next(error);
  }
};
