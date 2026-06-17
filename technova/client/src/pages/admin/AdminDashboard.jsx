import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../redux/slices/adminSlice';
import { HiUsers, HiCurrencyDollar, HiFolderOpen, HiStar } from 'react-icons/hi';
import StatCard from '../../components/dashboard/StatCard';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.admin || { stats: null, loading: false });

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard — TechNova</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Platform Overview</h1>
          <p className="text-surface-400">High-level KPIs and activity tracking.</p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-surface-400">Loading metrics...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard 
                title="Total Users" 
                value={stats?.totalUsers || 0} 
                icon={HiUsers}
              />
              <StatCard 
                title="Active Projects" 
                value={stats?.activeProjects || 0} 
                icon={HiFolderOpen}
              />
              <StatCard 
                title="Total Revenue" 
                value={`$${stats?.totalRevenue?.toLocaleString() || 0}`} 
                icon={HiCurrencyDollar}
                trend="up"
                trendValue="12%"
              />
              <StatCard 
                title="Pending Reviews" 
                value={stats?.pendingReviews || 0} 
                icon={HiStar}
                trend={stats?.pendingReviews > 0 ? 'down' : 'up'}
                trendValue="Needs action"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Trend Chart */}
              <div className="lg:col-span-2 glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Revenue Trend (Last 7 Months)</h2>
                <div className="h-72 w-full">
                  {stats?.revenueTrend ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.revenueTrend}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="name" stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-500">No data available</div>
                  )}
                </div>
              </div>

              {/* Project Status Chart */}
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Project Distribution</h2>
                <div className="h-72 w-full">
                  {stats?.projectStatus && stats.projectStatus.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.projectStatus}
                          cx="50%"
                          cy="45%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {stats.projectStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-500">No projects available</div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
