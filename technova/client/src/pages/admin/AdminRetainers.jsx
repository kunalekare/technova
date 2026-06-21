import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiPlus, HiRefresh } from 'react-icons/hi';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../redux/slices/adminSlice';

const AdminRetainers = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.admin || { users: [] });
  const [retainers, setRetainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Quick form for testing, in a real app we'd fetch clients to select from
  const [formData, setFormData] = useState({
    clientId: '',
    planName: 'Monthly Maintenance',
    monthlyAmount: '',
    currency: 'INR',
    billingDay: 1,
    includedHours: 10
  });

  const fetchRetainers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/retainers');
      setRetainers(res.data.data);
    } catch (error) {
      toast.error('Failed to load retainers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetainers();
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleCreateRetainer = async (e) => {
    e.preventDefault();
    try {
      await api.post('/retainers', {
        ...formData,
        monthlyAmount: Number(formData.monthlyAmount),
        billingDay: Number(formData.billingDay),
        includedHours: Number(formData.includedHours)
      });
      toast.success('Retainer Plan Created!');
      setShowForm(false);
      fetchRetainers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create retainer');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/retainers/${id}`, { status });
      toast.success('Status updated');
      fetchRetainers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-surface-400">Loading retainers...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Retainer Management | Admin Dashboard</title>
      </Helmet>

      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Retainer Plans</h1>
            <p className="text-surface-400 mt-1">Manage recurring subscriptions and client retainers.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={fetchRetainers}
              className="text-surface-400 hover:text-white transition-colors p-2 bg-surface-800 rounded-lg"
            >
              <HiRefresh className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="btn-primary flex items-center gap-2"
            >
              <HiPlus className="w-4 h-4" /> New Plan
            </button>
          </div>
        </div>

        {showForm && (
          <div className="glass-card p-6 border-primary-500/30">
            <h3 className="text-lg font-bold text-white mb-4">Create New Retainer</h3>
            <form onSubmit={handleCreateRetainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-surface-400 mb-1">Client</label>
                <select required className="input-field text-sm" value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})}>
                  <option value="" disabled>Select a Client</option>
                  {users.filter(u => u.role?.name !== 'admin').map(user => (
                    <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-surface-400 mb-1">Plan Name</label>
                <input required className="input-field text-sm" value={formData.planName} onChange={e => setFormData({...formData, planName: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-surface-400 mb-1">Monthly Amount</label>
                <input required type="number" className="input-field text-sm" value={formData.monthlyAmount} onChange={e => setFormData({...formData, monthlyAmount: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-surface-400 mb-1">Currency</label>
                <select className="input-field text-sm" value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})}>
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-surface-400 mb-1">Billing Day (1-28)</label>
                <input required type="number" min="1" max="28" className="input-field text-sm" value={formData.billingDay} onChange={e => setFormData({...formData, billingDay: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-surface-400 mb-1">Included Hours</label>
                <input required type="number" className="input-field text-sm" value={formData.includedHours} onChange={e => setFormData({...formData, includedHours: e.target.value})} />
              </div>
              <div className="col-span-full pt-2">
                <button type="submit" className="btn-primary w-full md:w-auto">Create Plan</button>
              </div>
            </form>
          </div>
        )}

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-800/50 border-b border-white/5">
                  <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Plan Name</th>
                  <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Client</th>
                  <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Billing Day</th>
                  <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {retainers.map(plan => (
                  <tr key={plan._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{plan.planName}</div>
                      <div className="text-xs text-surface-400 mt-0.5">{plan.includedHours} hrs included</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-surface-200">{plan.client?.name || 'Unknown'}</div>
                      <div className="text-xs text-surface-500">{plan.client?.email || plan.client}</div>
                    </td>
                    <td className="p-4 text-sm font-bold text-white">
                      {plan.currency} {plan.monthlyAmount?.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-surface-300">
                      Day {plan.billingDay}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                        plan.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                        plan.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {plan.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select 
                        value={plan.status}
                        onChange={(e) => handleUpdateStatus(plan._id, e.target.value)}
                        className="bg-surface-800 text-xs text-white px-2 py-1 rounded border border-white/10"
                      >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {retainers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-surface-400 text-sm">No retainers found.</td>
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

export default AdminRetainers;
