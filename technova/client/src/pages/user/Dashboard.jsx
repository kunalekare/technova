import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  HiFolderOpen, HiCreditCard, HiTicket, HiBell,
  HiPlusCircle, HiArrowRight, HiSparkles, HiHeart,
  HiCheckCircle, HiClock, HiLightningBolt, HiExclamation
} from 'react-icons/hi';
import { fetchDashboardStats } from '../../redux/slices/dashboardSlice';
import StatCard from '../../components/dashboard/StatCard';

const activityIcons = {
  project: HiFolderOpen,
  order: HiCreditCard,
  ticket: HiTicket,
};

const activityColors = {
  project: 'text-blue-400 bg-blue-500/10',
  order: 'text-emerald-400 bg-emerald-500/10',
  ticket: 'text-amber-400 bg-amber-500/10',
};

const statusIcons = {
  new: HiSparkles,
  in_progress: HiLightningBolt,
  completed: HiCheckCircle,
  pending: HiClock,
  open: HiExclamation,
  in_review: HiClock,
  paid: HiCheckCircle,
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, activities, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const quickActions = [
    { label: 'New Project', icon: HiPlusCircle, path: '/dashboard/projects?new=true', color: 'from-primary-500 to-primary-600' },
    { label: 'AI Scoper', icon: HiSparkles, path: '/dashboard/scoper', color: 'from-purple-500 to-pink-500' },
    { label: 'View Orders', icon: HiCreditCard, path: '/dashboard/orders', color: 'from-emerald-500 to-teal-500' },
    { label: 'Support', icon: HiTicket, path: '/dashboard/tickets', color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard — TechNova</title>
      </Helmet>
      
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-display font-bold text-white"
            >
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </motion.h1>
            <p className="text-surface-400 mt-1">Here's what's happening with your projects today.</p>
          </div>
          <Link to="/dashboard/projects?new=true" className="btn-primary text-sm !px-5 !py-2.5">
            <HiPlusCircle className="w-4 h-4 mr-2" />
            Submit Project
          </Link>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Active Projects"
            value={loading ? '—' : (stats?.activeProjects ?? 0)}
            icon={HiFolderOpen}
            trend={stats?.activeProjects > 0 ? 'up' : undefined}
            trendValue={stats?.activeProjects > 0 ? `${stats.totalProjects} total` : undefined}
          />
          <StatCard
            title="Pending Invoices"
            value={loading ? '—' : (stats?.pendingOrders ?? 0)}
            icon={HiCreditCard}
            trend={stats?.pendingOrders > 0 ? 'up' : undefined}
            trendValue={stats?.pendingOrders > 0 ? 'action needed' : undefined}
          />
          <StatCard
            title="Open Tickets"
            value={loading ? '—' : (stats?.openTickets ?? 0)}
            icon={HiTicket}
          />
          <StatCard
            title="Notifications"
            value={loading ? '—' : (stats?.unreadNotifications ?? 0)}
            icon={HiBell}
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-display font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={action.path}
                  className="group flex flex-col items-center gap-3 p-5 glass-card hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-surface-300 group-hover:text-white transition-colors">{action.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Two Column Layout: Activity Feed + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="lg:col-span-2 glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-display font-bold text-white">Recent Activity</h2>
              <span className="text-xs text-surface-500">{activities?.length || 0} events</span>
            </div>
            <div className="divide-y divide-white/5">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-surface-400 text-sm">Loading activity...</p>
                </div>
              ) : activities?.length === 0 ? (
                <div className="p-12 text-center">
                  <HiSparkles className="w-10 h-10 text-surface-600 mx-auto mb-3" />
                  <p className="text-surface-400 font-medium">No recent activity</p>
                  <p className="text-surface-500 text-sm mt-1">Submit your first project to get started!</p>
                </div>
              ) : (
                activities.map((activity, i) => {
                  const Icon = activityIcons[activity.type] || HiFolderOpen;
                  const colorClass = activityColors[activity.type] || 'text-surface-400 bg-white/5';
                  const StatusIcon = statusIcons[activity.status] || HiClock;
                  return (
                    <motion.div
                      key={`${activity.type}-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Link
                        to={activity.link}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                          <p className="text-xs text-surface-400 mt-0.5">{activity.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-[11px] text-surface-500">
                            {format(new Date(activity.date), 'MMM d')}
                          </span>
                          <StatusIcon className={`w-4 h-4 ${
                            activity.status === 'completed' || activity.status === 'paid' ? 'text-green-400' :
                            activity.status === 'in_progress' ? 'text-yellow-400' : 'text-surface-500'
                          }`} />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Side Stats */}
          <div className="space-y-5">
            {/* Project Completion */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-surface-400 mb-4">Project Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-surface-300">Completed</span>
                    <span className="text-green-400 font-semibold">{stats?.completedProjects ?? 0}</span>
                  </div>
                  <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: stats?.totalProjects > 0 ? `${(stats.completedProjects / stats.totalProjects) * 100}%` : '0%' }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-surface-300">Active</span>
                    <span className="text-primary-400 font-semibold">{stats?.activeProjects ?? 0}</span>
                  </div>
                  <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: stats?.totalProjects > 0 ? `${(stats.activeProjects / stats.totalProjects) * 100}%` : '0%' }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-primary-500 to-blue-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Services */}
            <Link to="/dashboard/wishlist" className="glass-card p-6 block hover:bg-white/[0.04] transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                    <HiHeart className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Saved Services</p>
                    <p className="text-2xl font-display font-bold text-white">{stats?.savedServices ?? 0}</p>
                  </div>
                </div>
                <HiArrowRight className="w-5 h-5 text-surface-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            {/* Order Stats */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-surface-400 mb-3">Orders</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-display font-bold text-white">{stats?.totalOrders ?? 0}</p>
                  <p className="text-xs text-surface-500 mt-1">Total orders placed</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-display font-bold text-amber-400">{stats?.pendingOrders ?? 0}</p>
                  <p className="text-xs text-surface-500 mt-1">Pending payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
