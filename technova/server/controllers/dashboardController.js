import Project from '../models/Project.js';
import Order from '../models/Order.js';
import Ticket from '../models/Ticket.js';
import Invoice from '../models/Invoice.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// @desc    Get dashboard overview stats
// @route   GET /api/v1/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [
      activeProjects,
      completedProjects,
      totalProjects,
      pendingOrders,
      totalOrders,
      openTickets,
      unreadNotifications,
      user,
    ] = await Promise.all([
      Project.countDocuments({ client: userId, status: { $in: ['new', 'in_review', 'in_progress', 'proposal_sent'] } }),
      Project.countDocuments({ client: userId, status: 'completed' }),
      Project.countDocuments({ client: userId }),
      Order.countDocuments({ user: userId, status: 'pending' }),
      Order.countDocuments({ user: userId }),
      Ticket.countDocuments({ user: userId, status: { $in: ['open', 'in_progress'] } }),
      Notification.countDocuments({ user: userId, isRead: false }),
      User.findById(userId).select('savedServices'),
    ]);

    // Recent activity — mix of recent projects, orders, tickets
    const [recentProjects, recentOrders, recentTickets] = await Promise.all([
      Project.find({ client: userId })
        .populate('service', 'title')
        .sort('-updatedAt')
        .limit(3)
        .lean(),
      Order.find({ user: userId })
        .populate('service', 'title')
        .sort('-updatedAt')
        .limit(3)
        .lean(),
      Ticket.find({ user: userId })
        .sort('-updatedAt')
        .limit(3)
        .lean(),
    ]);

    // Merge into activity feed
    const activities = [
      ...recentProjects.map(p => ({
        type: 'project',
        title: p.title,
        description: `Project "${p.title}" — ${p.status.replace('_', ' ')}`,
        status: p.status,
        date: p.updatedAt,
        link: `/dashboard/projects/${p._id}`,
      })),
      ...recentOrders.map(o => ({
        type: 'order',
        title: o.service?.title || 'Order',
        description: `Order #${o._id.toString().slice(-6).toUpperCase()} — ${o.status}`,
        status: o.status,
        date: o.updatedAt,
        link: `/dashboard/orders`,
      })),
      ...recentTickets.map(t => ({
        type: 'ticket',
        title: t.subject,
        description: `Ticket "${t.subject}" — ${t.status.replace('_', ' ')}`,
        status: t.status,
        date: t.updatedAt,
        link: `/dashboard/tickets`,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          activeProjects,
          completedProjects,
          totalProjects,
          pendingOrders,
          totalOrders,
          openTickets,
          unreadNotifications,
          savedServices: user?.savedServices?.length || 0,
        },
        activities,
      },
    });
  } catch (error) {
    next(error);
  }
};
