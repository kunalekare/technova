import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../redux/slices/adminSlice';
import { HiUsers, HiCurrencyDollar, HiFolderOpen } from 'react-icons/hi';
import StatCard from '../../components/dashboard/StatCard';

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>
        )}

        <div className="glass-card p-6 min-h-[300px]">
          <h2 className="text-lg font-semibold text-white mb-4">Revenue Analytics</h2>
          <div className="h-full flex items-center justify-center text-surface-400 text-sm">
            [Chart.js / Recharts visualization placeholder]
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
