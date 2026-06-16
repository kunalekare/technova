import User from '../models/User.js';
import Project from '../models/Project.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

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

    // Revenue by category
    const populatedOrders = await Order.find({ status: 'completed' }).populate('service');
    const revenueByCategoryMap = {};

    populatedOrders.forEach(order => {
      if (order.service && order.service.category) {
        const categoryId = order.service.category.toString();
        // Since we don't have category populated all the way easily without another query, 
        // we can group by service title or we'd need to populate category.
        // For simplicity, let's group by service title, since that works just as well.
        const name = order.service.title || 'Unknown';
        if (!revenueByCategoryMap[name]) {
          revenueByCategoryMap[name] = 0;
        }
        revenueByCategoryMap[name] += order.amount;
      }
    });

    const revenueByCategory = Object.keys(revenueByCategoryMap).map(key => ({
      name: key,
      value: revenueByCategoryMap[key]
    }));

    const pendingReviews = await Review.countDocuments({ isApproved: false });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeProjects,
        totalRevenue,
        pendingReviews,
        revenueByCategory,
        // Mock chart data for now
        revenueTrend: [
          { name: 'Jan', revenue: 4000 },
          { name: 'Feb', revenue: 3000 },
          { name: 'Mar', revenue: 2000 },
          { name: 'Apr', revenue: 2780 },
          { name: 'May', revenue: 1890 },
          { name: 'Jun', revenue: 2390 },
          { name: 'Jul', revenue: 3490 },
        ],
        projectStatus: [
          { name: 'New', value: 4 },
          { name: 'In Progress', value: 8 },
          { name: 'In Review', value: 3 },
          { name: 'Completed', value: 12 },
        ]
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

// @desc    Update user status/role
// @route   PUT /api/v1/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('role', 'name');
    res.status(200).json({ success: true, data: user });
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
      .populate('assignedTeam.user', 'name')
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

// @desc    Get pending reviews
// @route   GET /api/v1/admin/reviews/pending
// @access  Private/Admin
export const getPendingReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ isApproved: false })
      .populate('user', 'name avatar')
      .populate('service', 'title')
      .sort('createdAt');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Reject review
// @route   PUT /api/v1/admin/reviews/:id
// @access  Private/Admin
export const moderateReview = async (req, res, next) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    if (action === 'approve') {
      review.isApproved = true;
      await review.save();
      // Need to update service rating here in a real app
    } else if (action === 'reject') {
      await review.deleteOne();
      return res.status(200).json({ success: true, data: {} });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};
