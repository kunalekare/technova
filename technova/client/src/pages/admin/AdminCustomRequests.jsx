import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  HiOutlineSearch, HiInbox, HiOutlineUser, HiOutlineMail, 
  HiOutlineOfficeBuilding, HiOutlineCurrencyDollar, HiOutlineClock,
  HiOutlineChatAlt2, HiRefresh
} from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminCustomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  
  // Phase 8: AI Proposal States
  const [generatingAi, setGeneratingAi] = useState(null);
  const [aiProposals, setAiProposals] = useState({});
  const [converting, setConverting] = useState(null);

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
    setUpdatingId(id);
    try {
      await api.put(`/custom-requests/${id}/status`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchRequests();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleGenerateProposal = async (id) => {
    setGeneratingAi(id);
    try {
      const res = await api.get(`/ai/generate-proposal/${id}`);
      setAiProposals(prev => ({ ...prev, [id]: res.data.data }));
      toast.success('AI Proposal generated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate AI proposal');
    } finally {
      setGeneratingAi(null);
    }
  };

  const handleConvertToProject = async (id) => {
    const proposalData = aiProposals[id];
    if (!proposalData) return;
    
    setConverting(id);
    try {
      await api.post(`/custom-requests/${id}/convert-to-project`, { proposalData });
      toast.success('Successfully converted to project and proposal sent!');
      fetchRequests(); // Refresh list to remove resolved items
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to convert to project');
    } finally {
      setConverting(null);
    }
  };

  const statusConfig = {
    pending: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', label: 'Pending' },
    reviewed: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', label: 'Reviewed' },
    contacted: { color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', label: 'Contacted' },
    resolved: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', label: 'Resolved' }
  };

  return (
    <>
      <Helmet>
        <title>Custom Requests — Admin | TechNova</title>
      </Helmet>

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Custom Requests</h1>
            <p className="text-surface-400 text-sm mt-1">Review and respond to client queries for unlisted services.</p>
          </div>
          <div className="relative min-w-[200px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-surface-900 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="contacted">Contacted</option>
              <option value="resolved">Resolved</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-surface-400">
              ▼
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 glass-card animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-500/10 text-red-400 p-6 rounded-2xl border border-red-500/20 text-center font-medium">
            {error}
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 glass-card">
            <div className="w-20 h-20 rounded-full bg-surface-800 flex items-center justify-center mb-6 border border-white/5">
              <HiInbox className="w-10 h-10 text-surface-500" />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">No Requests Found</h3>
            <p className="text-surface-400 text-sm max-w-sm text-center">There are no custom service requests matching your criteria right now.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((req, idx) => {
              const currentStatus = statusConfig[req.status] || statusConfig.pending;
              
              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={req._id}
                  className="glass-card overflow-hidden hover:border-white/10 transition-colors"
                >
                  <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8">
                    {/* Left: Request Content */}
                    <div className="flex-1 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold tracking-wider text-primary-400 uppercase mb-2">Requested Service</p>
                          <h3 className="text-2xl font-bold text-white">{req.serviceName}</h3>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${currentStatus.color}`}>
                          {currentStatus.label}
                        </span>
                      </div>

                      <div className="bg-surface-900/50 border border-white/5 p-5 rounded-2xl relative">
                        <HiOutlineChatAlt2 className="absolute top-5 right-5 text-surface-600 w-6 h-6 opacity-50" />
                        <h4 className="text-xs font-medium text-surface-400 mb-2">Detailed Requirements</h4>
                        <p className="text-surface-200 text-sm leading-relaxed whitespace-pre-wrap">{req.description}</p>
                      </div>
                    </div>

                    {/* Right: Client Details & Actions */}
                    <div className="lg:w-80 flex flex-col gap-6 lg:border-l border-white/10 lg:pl-8">
                      <div className="space-y-4 flex-1">
                        <h4 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Client Details</h4>
                        
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center text-surface-400">
                            <HiOutlineUser className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <p className="text-xs text-surface-500">Name</p>
                            <p className="text-white font-medium truncate">{req.name}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center text-surface-400">
                            <HiOutlineMail className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <p className="text-xs text-surface-500">Email</p>
                            <a href={`mailto:${req.email}`} className="text-primary-400 hover:text-primary-300 transition-colors truncate block">{req.email}</a>
                          </div>
                        </div>

                        {req.company && (
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center text-surface-400">
                              <HiOutlineOfficeBuilding className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <p className="text-xs text-surface-500">Company</p>
                              <p className="text-white truncate">{req.company}</p>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 pt-2">
                          {req.budget && (
                            <div className="bg-surface-900 rounded-xl p-3 border border-white/5">
                              <HiOutlineCurrencyDollar className="w-4 h-4 text-emerald-400 mb-1" />
                              <p className="text-xs text-surface-500">Budget</p>
                              <p className="text-sm text-white font-semibold">${req.budget}</p>
                            </div>
                          )}
                          <div className="bg-surface-900 rounded-xl p-3 border border-white/5">
                            <HiOutlineClock className="w-4 h-4 text-blue-400 mb-1" />
                            <p className="text-xs text-surface-500">Submitted</p>
                            <p className="text-sm text-white font-semibold">{new Date(req.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 bg-surface-900 border border-white/10 rounded-xl p-1.5 pl-4">
                          <span className="text-xs text-surface-400 font-medium">Status:</span>
                          <select
                            disabled={updatingId === req._id}
                            value={req.status}
                            onChange={(e) => updateStatus(req._id, e.target.value)}
                            className="flex-1 bg-transparent text-sm text-white focus:outline-none cursor-pointer appearance-none pr-8 py-2 font-medium"
                          >
                            <option value="pending" className="bg-surface-800 text-white">Pending</option>
                            <option value="reviewed" className="bg-surface-800 text-white">Reviewed</option>
                            <option value="contacted" className="bg-surface-800 text-white">Contacted</option>
                            <option value="resolved" className="bg-surface-800 text-white">Resolved</option>
                          </select>
                          {updatingId === req._id && <HiRefresh className="w-4 h-4 text-primary-500 animate-spin mr-3" />}
                        </div>
                        <a 
                          href={`mailto:${req.email}?subject=Regarding your Custom Service Request: ${req.serviceName}`}
                          className="btn-primary w-full flex justify-center items-center py-2.5 text-sm"
                        >
                          <HiOutlineMail className="w-4 h-4 mr-2" /> Email Client
                        </a>

                        {/* Phase 8: AI Quote Generator */}
                        {req.status !== 'resolved' && !aiProposals[req._id] && (
                          <button
                            onClick={() => handleGenerateProposal(req._id)}
                            disabled={generatingAi === req._id}
                            className="w-full bg-gradient-to-r from-purple-600 to-primary-600 hover:from-purple-500 hover:to-primary-500 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center text-sm"
                          >
                            {generatingAi === req._id ? (
                              <HiRefresh className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <span className="mr-2">✨</span>
                            )}
                            {generatingAi === req._id ? 'Generating...' : 'Auto-Generate Proposal'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Render AI Proposal if generated */}
                  {aiProposals[req._id] && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-white/5 bg-surface-900/30 p-6 sm:p-8"
                    >
                      <div className="flex items-center gap-2 mb-6">
                        <span className="text-xl">✨</span>
                        <h4 className="text-lg font-bold text-white">AI Generated Proposal</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-surface-800 rounded-xl p-5 border border-white/5">
                          <p className="text-xs text-surface-400 mb-1 uppercase tracking-wider font-semibold">Estimated Cost</p>
                          <p className="text-2xl font-bold text-emerald-400">${aiProposals[req._id].price.toLocaleString()}</p>
                        </div>
                        <div className="bg-surface-800 rounded-xl p-5 border border-white/5 md:col-span-2">
                          <p className="text-xs text-surface-400 mb-1 uppercase tracking-wider font-semibold">Timeline & Scope</p>
                          <p className="text-sm text-primary-400 font-bold mb-2">{aiProposals[req._id].timeline}</p>
                          <p className="text-sm text-surface-300 leading-relaxed">{aiProposals[req._id].scopeSummary}</p>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h5 className="text-sm font-bold text-white mb-4">Proposed Milestones</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {aiProposals[req._id].milestones.map((m, i) => (
                            <div key={i} className="bg-surface-900 rounded-xl p-4 border border-white/5 flex gap-4">
                              <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center font-bold flex-shrink-0">
                                {i + 1}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white mb-1">{m.title}</p>
                                <p className="text-xs text-surface-400">{m.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => setAiProposals(prev => { const n = {...prev}; delete n[req._id]; return n; })}
                          className="px-4 py-2 text-sm text-surface-400 hover:text-white transition-colors"
                        >
                          Discard
                        </button>
                        <button
                          onClick={() => handleConvertToProject(req._id)}
                          disabled={converting === req._id}
                          className="btn-primary py-2 px-6 flex items-center"
                        >
                          {converting === req._id ? (
                            <><HiRefresh className="w-4 h-4 mr-2 animate-spin" /> Converting...</>
                          ) : (
                            'Convert to Project & Send Proposal'
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminCustomRequests;
