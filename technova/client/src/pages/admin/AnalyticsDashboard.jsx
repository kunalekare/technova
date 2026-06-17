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

  const categoryData = stats?.revenueByCategory || [];
  const userGrowthData = stats?.userGrowth || [];

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

        {loading && !stats ? (
          <div className="p-12 text-center text-surface-400 flex justify-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Revenue by Category</h2>
              <div className="h-72 w-full">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 12 }} />
                      <YAxis stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                      <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#3b82f6' }} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-surface-400 text-sm">
                    No revenue data available
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-6">User Growth (Last 30 Days)</h2>
              <div className="h-72 w-full">
                {userGrowthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="date" stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 12 }} tickFormatter={(val, index) => index % 5 === 0 ? val : ''} />
                      <YAxis stroke="#ffffff40" tick={{ fill: '#ffffff60', fontSize: 12 }} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px', color: '#fff' }} 
                        itemStyle={{ color: '#10b981' }} 
                        cursor={{ stroke: '#ffffff20' }}
                      />
                      <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-surface-400 text-sm">
                    No user data available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AnalyticsDashboard;
