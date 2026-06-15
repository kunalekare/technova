import Category from '../models/Category.js';
import Service from '../models/Service.js';

// @desc    Get all active categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('name');
    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by slug with its services
// @route   GET /api/v1/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const services = await Service.find({
      category: category._id,
      isActive: true,
    })
      .populate('category', 'name slug icon')
      .sort('-createdAt');

    res.json({
      success: true,
      data: {
        category,
        services,
      },
    });
  } catch (error) {
    next(error);
  }
};
