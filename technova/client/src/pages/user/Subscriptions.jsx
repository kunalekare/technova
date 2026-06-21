import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiOutlineRefresh, HiOutlineCreditCard } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/subscriptions/my-subscriptions');
      setSubscriptions(res.data.data);
    } catch (error) {
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) return;
    try {
      await api.put(`/subscriptions/${id}/cancel`);
      toast.success('Subscription cancelled successfully');
      fetchSubscriptions();
    } catch (error) {
      toast.error('Failed to cancel subscription');
    }
  };

  const handleTestSubscription = async () => {
    setIsCreating(true);
    try {
      // 1. Fetch available services
      const res = await api.get('/services');
      const services = res.data.data;
      if (!services || services.length === 0) {
        toast.error('No services available in the database to subscribe to!');
        return;
      }
      
      // 2. Pick the first service to test
      const testService = services[0];
      
      // 3. Create subscription
      await api.post('/subscriptions', {
        serviceId: testService._id,
        amount: testService.startingPrice || 5000,
        planName: `Test ${testService.title} Plan`
      });
      
      toast.success('Test Subscription Created!');
      fetchSubscriptions();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to create test subscription');
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-surface-400">Loading your subscriptions...</div>;
  }

  if (subscriptions.length === 0) {
    return (
      <div className="p-12 text-center">
        <HiOutlineCreditCard className="w-16 h-16 text-surface-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No Active Subscriptions</h2>
        <p className="text-surface-400 mb-6">You don't have any automated subscriptions yet.</p>
        <div className="flex justify-center gap-4">
          <Link to="/services" className="btn-primary">Browse Services</Link>
          <button 
            onClick={handleTestSubscription} 
            disabled={isCreating}
            className="px-6 py-3 bg-surface-800 text-white font-bold rounded-xl hover:bg-surface-700 transition-colors border border-white/10 shadow-lg disabled:opacity-50 flex items-center gap-2"
          >
            {isCreating ? 'Creating...' : 'Test Create Subscription'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Subscriptions | Dashboard</title>
      </Helmet>

      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">My Subscriptions</h1>
            <p className="text-surface-400 mt-1">Manage your recurring subscriptions and automated billing.</p>
          </div>
          <button 
            onClick={fetchSubscriptions}
            className="text-surface-400 hover:text-white transition-colors p-2 bg-surface-800 rounded-lg"
          >
            <HiOutlineRefresh className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subscriptions.map(sub => (
            <div key={sub._id} className="glass-card p-6 border-t-4 border-t-primary-500 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{sub.service?.title || 'Service Subscription'}</h3>
                    <p className="text-surface-400 text-sm mt-1">Sub ID: {sub.razorpaySubscriptionId}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                    sub.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                    sub.status === 'created' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {sub.status}
                  </span>
                </div>

                <div className="py-4 border-y border-white/5 my-4">
                  <div className="flex justify-between items-center text-sm text-surface-300">
                    <span>Next Billing Date</span>
                    <span className="text-white font-medium">
                      {sub.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString() : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                {sub.status === 'created' && sub.shortUrl && (
                  <a href={sub.shortUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full text-center">
                    Pay Now
                  </a>
                )}
                {sub.status === 'active' && (
                  <button onClick={() => handleCancel(sub._id)} className="btn-danger w-full">
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Subscriptions;
