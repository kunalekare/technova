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
    const activeProjectsCount = await Project.countDocuments({ status: { $in: ['new', 'in_progress', 'in_review'] } });
    
    // Calculate total revenue
    const orders = await Order.find({ status: 'completed' });
    const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);

    // Revenue by category (grouped by service title)
    const populatedOrders = await Order.find({ status: 'completed' }).populate('service');
    const revenueByCategoryMap = {};

    populatedOrders.forEach(order => {
      if (order.service && order.service.category) {
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

    // Actual Project Status Distribution
    const projects = await Project.find({});
    const projectCounts = { 'new': 0, 'in_progress': 0, 'in_review': 0, 'completed': 0, 'cancelled': 0 };
    projects.forEach(p => {
      if (projectCounts[p.status] !== undefined) {
        projectCounts[p.status]++;
      }
    });
    
    const projectStatus = [
      { name: 'New', value: projectCounts['new'] },
      { name: 'In Progress', value: projectCounts['in_progress'] },
      { name: 'In Review', value: projectCounts['in_review'] },
      { name: 'Completed', value: projectCounts['completed'] },
      { name: 'Cancelled', value: projectCounts['cancelled'] }
    ].filter(item => item.value > 0); // Only return non-zero

    // Actual Revenue Trend (Last 7 Months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueTrend = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const targetMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      
      const monthlyOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= targetMonth && orderDate <= endMonth;
      });
      
      const monthRevenue = monthlyOrders.reduce((sum, o) => sum + o.amount, 0);
      revenueTrend.push({
        name: months[targetMonth.getMonth()],
        revenue: monthRevenue
      });
    }

    // User Growth (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.find({ createdAt: { $gte: thirtyDaysAgo } }, 'createdAt');
    
    const userGrowthMap = {};
    for (let i = 0; i <= 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      userGrowthMap[dateStr] = 0;
    }
    
    recentUsers.forEach(u => {
      const dateStr = new Date(u.createdAt).toISOString().split('T')[0];
      if (userGrowthMap[dateStr] !== undefined) {
        userGrowthMap[dateStr]++;
      }
    });

    const userGrowth = Object.keys(userGrowthMap).sort().map(dateStr => ({
      date: dateStr.split('-').slice(1).join('/'), // MM/DD
      users: userGrowthMap[dateStr]
    }));

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeProjects: activeProjectsCount,
        totalRevenue,
        pendingReviews,
        revenueByCategory,
        revenueTrend,
        projectStatus,
        userGrowth
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
