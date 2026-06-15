import User from '../models/User.js';
import Project from '../models/Project.js';
import Order from '../models/Order.js';

// @desc    Get dashboard KPIs
// @route   GET /api/v1/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeProjects = await Project.countDocuments({ status: { $in: ['new', 'in_progress', 'in_review'] } });
    
    // Calculate total revenue
    const orders = await Order.find({ status: 'completed' });
    const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeProjects,
        totalRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('role', 'name').sort('-createdAt');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects (admin view)
// @route   GET /api/v1/admin/projects
// @access  Private/Admin
export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate('client', 'name email')
      .populate('service', 'title')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};
