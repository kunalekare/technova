import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiInbox, HiCheck, HiOutlineX } from 'react-icons/hi';
import api from '../../services/api';

const AdminCustomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/custom-requests', {
        params: { status: statusFilter }
      });
      setRequests(res.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load custom requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/custom-requests/${id}/status`, { status: newStatus });
      fetchRequests();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Helmet>
        <title>Custom Requests Management - TechNova Admin</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Custom Service Requests</h1>
          <p className="text-surface-400 mt-1">Manage user queries for unlisted services.</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="contacted">Contacted</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-surface-800/50 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20">
          {error}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-surface-900 rounded-3xl border border-white/5">
          <HiInbox className="w-16 h-16 text-surface-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Requests Found</h3>
          <p className="text-surface-400">There are no custom service requests matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={req._id}
              className="bg-surface-900 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row gap-6 hover:border-white/10 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{req.serviceName}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    req.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400' :
                    req.status === 'contacted' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>
                <p className="text-surface-300 text-sm mb-4">{req.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 text-sm">
                  <div>
                    <span className="text-surface-500 block text-xs">Name</span>
                    <span className="text-white">{req.name}</span>
                  </div>
                  <div>
                    <span className="text-surface-500 block text-xs">Email</span>
                    <span className="text-white">{req.email}</span>
                  </div>
                  {req.company && (
                    <div>
                      <span className="text-surface-500 block text-xs">Company</span>
                      <span className="text-white">{req.company}</span>
                    </div>
                  )}
                  {req.budget && (
                    <div>
                      <span className="text-surface-500 block text-xs">Budget</span>
                      <span className="text-white">{req.budget}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-surface-500 block text-xs">Submitted</span>
                    <span className="text-surface-400">{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                {req.status !== 'pending' && (
                  <button onClick={() => updateStatus(req._id, 'pending')} className="w-full py-2 text-sm text-surface-400 hover:text-white transition-colors">Mark Pending</button>
                )}
                {req.status !== 'reviewed' && (
                  <button onClick={() => updateStatus(req._id, 'reviewed')} className="w-full py-2 text-sm bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">Mark Reviewed</button>
                )}
                {req.status !== 'contacted' && (
                  <button onClick={() => updateStatus(req._id, 'contacted')} className="w-full py-2 text-sm bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors">Mark Contacted</button>
                )}
                {req.status !== 'resolved' && (
                  <button onClick={() => updateStatus(req._id, 'resolved')} className="w-full py-2 text-sm bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors">Mark Resolved</button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCustomRequests;
