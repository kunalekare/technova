import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { HiOutlineCurrencyDollar, HiTrendingUp, HiOutlineRefresh } from 'react-icons/hi';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const AdminFinanceDashboard = () => {
  const [forecast, setForecast] = useState(null);
  const [profitability, setProfitability] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      const [forecastRes, profitRes] = await Promise.all([
        api.get('/finance/forecast'),
        api.get('/finance/profitability')
      ]);
      setForecast(forecastRes.data.data);
      setProfitability(profitRes.data.data);
    } catch (error) {
      toast.error('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-surface-400">Loading financial intelligence...</div>;
  }

  // Prepare data for bar chart
  const barData = profitability.map(p => ({
    name: p.projectTitle.length > 15 ? p.projectTitle.substring(0, 15) + '...' : p.projectTitle,
    Revenue: p.revenue_inr,
    Cost: p.cost_inr,
    Profit: p.profit_inr
  }));

  // Prepare data for pie chart (Forecast breakdown)
  const pieData = [
    { name: 'Retainer MRR', value: forecast?.mrr_inr || 0 },
    { name: 'Pending Orders', value: forecast?.pending_orders_inr || 0 }
  ];

  return (
    <>
      <Helmet>
        <title>Financial Intelligence | Admin Dashboard</title>
      </Helmet>

      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Financial Intelligence</h1>
            <p className="text-surface-400 mt-1">Forecasting, Multi-Currency tracking, and Profitability analysis</p>
          </div>
          <button 
            onClick={fetchFinanceData}
            className="text-surface-400 hover:text-white transition-colors p-2 bg-surface-800 rounded-lg"
            title="Refresh Data"
          >
            <HiOutlineRefresh className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <HiOutlineCurrencyDollar className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-surface-300">Total Pipeline Forecast</p>
            </div>
            <h3 className="text-3xl font-bold text-white">₹{forecast?.total_forecast_inr?.toLocaleString() || 0}</h3>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <HiTrendingUp className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-surface-300">Retainer MRR</p>
            </div>
            <h3 className="text-3xl font-bold text-white">₹{forecast?.mrr_inr?.toLocaleString() || 0}</h3>
            <p className="text-xs text-surface-500 mt-1">Monthly Recurring Revenue</p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                <HiOutlineCurrencyDollar className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-surface-300">Pending Orders</p>
            </div>
            <h3 className="text-3xl font-bold text-white">₹{forecast?.pending_orders_inr?.toLocaleString() || 0}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 lg:col-span-2 border-primary-500/10">
            <h3 className="text-lg font-semibold text-white mb-6">Project Profitability Analysis</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#e5e7eb' }}
                  />
                  <Legend />
                  <Bar dataKey="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Cost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 border-primary-500/10">
            <h3 className="text-lg font-semibold text-white mb-6">Revenue Forecast Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-semibold text-white">Profitability Details (INR converted)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-800/50">
                  <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Project</th>
                  <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Client</th>
                  <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider text-right">Revenue (₹)</th>
                  <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider text-right">Internal Cost (₹)</th>
                  <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider text-right">Net Profit (₹)</th>
                  <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider text-right">Margin (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {profitability.map(p => (
                  <tr key={p.projectId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white text-sm">{p.projectTitle}</div>
                      <div className="text-[10px] text-surface-400 uppercase tracking-wider">{p.status}</div>
                    </td>
                    <td className="p-4 text-sm text-surface-300">{p.clientName}</td>
                    <td className="p-4 text-sm text-white font-medium text-right">{p.revenue_inr.toLocaleString()}</td>
                    <td className="p-4 text-sm text-red-400 font-medium text-right">{p.cost_inr.toLocaleString()}</td>
                    <td className="p-4 text-sm text-emerald-400 font-bold text-right">{p.profit_inr.toLocaleString()}</td>
                    <td className="p-4 text-sm text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        p.margin_percentage > 50 ? 'bg-emerald-500/20 text-emerald-400' :
                        p.margin_percentage > 20 ? 'bg-blue-500/20 text-blue-400' :
                        p.margin_percentage > 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {p.margin_percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
                {profitability.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-surface-400 text-sm">No completed or in-progress projects found for profitability tracking.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
};

export default AdminFinanceDashboard;
