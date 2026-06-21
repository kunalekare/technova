import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiOutlineRefresh, HiOutlineCreditCard } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const ClientRetainers = () => {
  const [retainers, setRetainers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRetainers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/retainers/my');
      setRetainers(res.data.data);
    } catch (error) {
      toast.error('Failed to load retainers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetainers();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-surface-400">Loading your retainers...</div>;
  }

  if (retainers.length === 0) {
    return (
      <div className="p-12 text-center">
        <HiOutlineCreditCard className="w-16 h-16 text-surface-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No Active Retainers</h2>
        <p className="text-surface-400 mb-6">You don't have any recurring retainer plans with us yet.</p>
        <Link to="/services" className="btn-primary">Browse Services</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Retainers | Dashboard</title>
      </Helmet>

      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">My Retainers</h1>
            <p className="text-surface-400 mt-1">Manage your recurring subscriptions and included hours.</p>
          </div>
          <button 
            onClick={fetchRetainers}
            className="text-surface-400 hover:text-white transition-colors p-2 bg-surface-800 rounded-lg"
          >
            <HiOutlineRefresh className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {retainers.map(plan => (
            <div key={plan._id} className="glass-card p-6 border-t-4 border-t-primary-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.planName}</h3>
                  <p className="text-surface-400 text-sm mt-1">Included Hours: {plan.includedHours} hrs/month</p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                  plan.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                  plan.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {plan.status}
                </span>
              </div>

              <div className="py-4 border-y border-white/5 my-4">
                <p className="text-sm text-surface-300 mb-1">Monthly Billing</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white">{plan.currency} {plan.monthlyAmount?.toLocaleString()}</span>
                  <span className="text-surface-500 text-sm mb-1">/ month</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-surface-400">Bills on the <strong className="text-white">{plan.billingDay}{
                  plan.billingDay === 1 ? 'st' : plan.billingDay === 2 ? 'nd' : plan.billingDay === 3 ? 'rd' : 'th'
                }</strong> of every month</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ClientRetainers;
