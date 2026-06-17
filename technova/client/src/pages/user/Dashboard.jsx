import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  HiFolderOpen, HiCreditCard, HiTicket, HiBell,
  HiPlusCircle, HiArrowRight, HiSparkles, HiHeart,
  HiCheckCircle, HiClock, HiLightningBolt, HiExclamation, HiOutlineChartSquareBar
} from 'react-icons/hi';
import { fetchDashboardStats } from '../../redux/slices/dashboardSlice';
import StatCard from '../../components/dashboard/StatCard';

const activityIcons = {
  project: HiFolderOpen,
  order: HiCreditCard,
  ticket: HiTicket,
};

const activityColors = {
  project: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  order: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  ticket: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
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

const statusColors = {
  completed: 'text-emerald-400',
  paid: 'text-emerald-400',
  in_progress: 'text-blue-400',
  new: 'text-purple-400',
  open: 'text-amber-400',
  pending: 'text-amber-400',
  default: 'text-surface-500',
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, activities, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const quickActions = [
    { label: 'New Project', desc: 'Request a new service', icon: HiPlusCircle, path: '/dashboard/projects?new=true', color: 'from-primary-500 to-indigo-600', shadow: 'shadow-primary-500/20' },
    { label: 'AI Scoper', desc: 'Generate project specs', icon: HiSparkles, path: '/dashboard/scoper', color: 'from-purple-500 to-pink-600', shadow: 'shadow-purple-500/20' },
    { label: 'Payments', desc: 'View pending invoices', icon: HiCreditCard, path: '/dashboard/orders', color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
    { label: 'Support', desc: 'Open a help ticket', icon: HiTicket, path: '/dashboard/tickets', color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
  ];

  return (
    <>
      <Helmet>
        <title>Client Dashboard | Velixora</title>
      </Helmet>
      
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-surface-900/50 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20" />
          
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight"
            >
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">{user?.name?.split(' ')[0]}</span>! 👋
            </motion.h1>
            <p className="text-surface-400 mt-2 text-lg">Here's the latest pulse on your digital projects.</p>
          </div>
          <div className="relative z-10 shrink-0">
            <Link to="/dashboard/projects?new=true" className="btn-primary !px-6 !py-3 shadow-lg shadow-primary-500/25 flex items-center font-bold text-sm rounded-xl">
              <HiPlusCircle className="w-5 h-5 mr-2" />
              Request New Project
            </Link>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            trend={stats?.pendingOrders > 0 ? 'down' : undefined}
            trendValue={stats?.pendingOrders > 0 ? 'action needed' : undefined}
          />
          <StatCard
            title="Open Tickets"
            value={loading ? '—' : (stats?.openTickets ?? 0)}
            icon={HiTicket}
            trend={stats?.openTickets > 0 ? 'up' : undefined}
          />
          <StatCard
            title="Notifications"
            value={loading ? '—' : (stats?.unreadNotifications ?? 0)}
            icon={HiBell}
            trend={stats?.unreadNotifications > 0 ? 'up' : undefined}
          />
        </div>

        {/* Two Column Layout: Activity Feed + Side Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Feed Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Actions Portal */}
            <div>
              <h2 className="text-lg font-display font-bold text-white mb-5 flex items-center gap-2">
                <HiOutlineChartSquareBar className="w-5 h-5 text-primary-400" /> Quick Portal
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, i) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={action.path}
                      className="group flex items-center gap-4 p-5 glass-card rounded-2xl hover:bg-surface-800 transition-all duration-300 border border-white/5 hover:border-white/10"
                    >
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shrink-0 shadow-lg ${action.shadow} group-hover:scale-105 transition-transform duration-300`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="block text-white font-bold group-hover:text-primary-300 transition-colors">{action.label}</span>
                        <span className="text-xs text-surface-400 mt-0.5 block">{action.desc}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
              <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-surface-900/50">
                <div>
                  <h2 className="text-lg font-display font-bold text-white">Recent Activity Tracker</h2>
                  <p className="text-xs text-surface-400 mt-1">Live updates on your operations.</p>
                </div>
                <span className="px-3 py-1 bg-primary-500/10 text-primary-400 border border-primary-500/20 rounded-lg text-xs font-bold">
                  {activities?.length || 0} Events
                </span>
              </div>
              <div className="divide-y divide-white/5">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-surface-400 font-medium text-sm">Syncing latest activity...</p>
                  </div>
                ) : activities?.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="w-20 h-20 bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <HiSparkles className="w-10 h-10 text-surface-500" />
                    </div>
                    <p className="text-white font-bold text-lg">No recent activity found</p>
                    <p className="text-surface-400 text-sm mt-2 max-w-sm mx-auto">Submit your first project request to start filling up your dashboard tracker!</p>
                  </div>
                ) : (
                  activities.map((activity, i) => {
                    const Icon = activityIcons[activity.type] || HiFolderOpen;
                    const colorClass = activityColors[activity.type] || 'text-surface-400 bg-surface-800 border-white/5';
                    const StatusIcon = statusIcons[activity.status] || HiClock;
                    const statusColor = statusColors[activity.status] || statusColors.default;
                    
                    return (
                      <motion.div
                        key={`${activity.type}-${i}`}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          to={activity.link}
                          className="flex items-start sm:items-center gap-5 px-8 py-5 hover:bg-surface-800/50 transition-colors group relative"
                        >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${colorClass} group-hover:scale-105 transition-transform`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-bold text-white truncate group-hover:text-primary-300 transition-colors">{activity.title}</p>
                            <p className="text-sm text-surface-400 mt-1 line-clamp-1">{activity.description}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0 mt-1 sm:mt-0">
                            <span className="text-xs font-medium text-surface-500">
                              {format(new Date(activity.date), 'MMM d, h:mm a')}
                            </span>
                            <div className="flex items-center gap-1.5 bg-surface-950/50 px-2.5 py-1 rounded-md">
                              <StatusIcon className={`w-3.5 h-3.5 ${statusColor}`} />
                              <span className={`text-[10px] uppercase tracking-wider font-bold ${statusColor}`}>
                                {activity.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          
          {/* Side Context Column */}
          <div className="space-y-6">
            
            {/* Project Status Ring / Bar */}
            <div className="glass-card p-8 rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px]" />
              <h3 className="text-sm font-bold text-surface-400 uppercase tracking-widest mb-6">Global Status</h3>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2 font-bold">
                    <span className="text-white">Completed Deployments</span>
                    <span className="text-emerald-400">{stats?.completedProjects ?? 0}</span>
                  </div>
                  <div className="h-3 bg-surface-800/80 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: stats?.totalProjects > 0 ? `${(stats.completedProjects / stats.totalProjects) * 100}%` : '0%' }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-sm mb-2 font-bold">
                    <span className="text-white">Active Pipelines</span>
                    <span className="text-primary-400">{stats?.activeProjects ?? 0}</span>
                  </div>
                  <div className="h-3 bg-surface-800/80 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: stats?.totalProjects > 0 ? `${(stats.activeProjects / stats.totalProjects) * 100}%` : '0%' }}
                      transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-primary-500 to-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Invoices Alert Card */}
            <div className="glass-card p-8 rounded-3xl border border-amber-500/20 bg-amber-500/5 relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <HiCreditCard className="w-32 h-32 text-amber-500" />
              </div>
              <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4 relative z-10">Financial Overview</h3>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-3xl font-display font-bold text-white">{stats?.totalOrders ?? 0}</p>
                  <p className="text-xs text-surface-400 mt-1 font-medium">Total Orders Processed</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-amber-400">{stats?.pendingOrders ?? 0}</p>
                  <p className="text-xs text-amber-400/80 mt-1 font-medium">Awaiting Payment</p>
                </div>
              </div>
              {stats?.pendingOrders > 0 && (
                <Link to="/dashboard/orders" className="mt-6 block w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-surface-950 font-bold text-sm text-center rounded-xl transition-colors relative z-10 shadow-lg shadow-amber-500/20">
                  Review Invoices
                </Link>
              )}
            </div>

            {/* Saved Services Shortcut */}
            <Link to="/dashboard/wishlist" className="glass-card p-6 block hover:bg-surface-800 transition-all group rounded-3xl border border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 group-hover:scale-105 transition-transform">
                    <HiHeart className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">Saved Services</p>
                    <p className="text-xs text-surface-400 mt-0.5">Your pinned packages</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-display font-bold text-white">{stats?.savedServices ?? 0}</span>
                  <HiArrowRight className="w-5 h-5 text-surface-500 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
