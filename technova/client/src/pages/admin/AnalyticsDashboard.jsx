import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchDashboardStats } from '../../redux/slices/adminSlice';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

const AnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.admin || { stats: null, loading: false });

  useEffect(() => {
    if (!stats) {
      dispatch(fetchDashboardStats());
    }
  }, [dispatch, stats]);

  // Example mocked data if no stats
  const categoryData = stats?.revenueByCategory || [
    { name: 'Web Dev', value: 12000 },
    { name: 'Design', value: 8500 },
    { name: 'SEO', value: 3200 },
    { name: 'Marketing', value: 4500 }
  ];

  return (
    <>
      <Helmet>
        <title>Deep Analytics — TechNova Admin</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Deep Analytics</h1>
          <p className="text-surface-400 text-sm mt-1">Detailed performance metrics across all services.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Revenue by Category</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 12 }} />
                  <YAxis stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-6">User Growth (Last 30 Days)</h2>
            <div className="h-72 w-full">
              <div className="h-full flex items-center justify-center text-surface-400">
                Data pipeline configuring...
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsDashboard;
