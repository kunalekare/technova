import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Helmet>
        <title>Dashboard — TechNova</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-surface-400">Here's what's happening with your projects today.</p>
        </div>

        {/* Overview Cards placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-surface-400 text-sm font-medium">Active Projects</h3>
            <p className="text-3xl font-display font-bold text-white mt-2">0</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-surface-400 text-sm font-medium">Completed</h3>
            <p className="text-3xl font-display font-bold text-white mt-2">0</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-surface-400 text-sm font-medium">Saved Services</h3>
            <p className="text-3xl font-display font-bold text-white mt-2">0</p>
          </div>
        </div>

        {/* Recent Activity placeholder */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-display font-bold text-white mb-4">Recent Activity</h2>
          <div className="py-8 text-center text-surface-400">
            No recent activity to show.
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
