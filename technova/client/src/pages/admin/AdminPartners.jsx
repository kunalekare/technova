import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiOutlineBriefcase, HiOutlineClock, HiOutlineCurrencyDollar, HiOutlineExternalLink, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';

const AdminPartners = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [actionModal, setActionModal] = useState({ isOpen: false, type: '', application: null });
  const [actionData, setActionData] = useState({ reviewNotes: '', commissionRate: 20 });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    api.get('/partners/applications')
      .then(res => setApplications(res.data.data))
      .catch(err => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  };

  const submitAction = async () => {
    try {
      await api.put(`/partners/applications/${actionModal.application._id}`, { 
        status: actionModal.type, 
        reviewNotes: actionData.reviewNotes,
        commissionRate: actionData.commissionRate 
      });
      toast.success(`Application ${actionModal.type} successfully`);
      setActionModal({ isOpen: false, type: '', application: null });
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const filteredApps = applications.filter(app => filter === 'all' || app.status === filter);

  return (
    <>
      <Helmet>
        <title>Manage Partners ATS | Admin</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Partner ATS</h1>
            <p className="text-surface-400 mt-1">Review and manage talent network applications</p>
          </div>
          
          <div className="flex bg-surface-800 p-1 rounded-xl">
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  filter === f ? 'bg-primary-600 text-white shadow-md' : 'text-surface-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-surface-400">Loading pipeline...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="glass-card p-16 text-center border border-white/5 border-dashed">
            <HiOutlineBriefcase className="w-16 h-16 text-surface-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No applications found</h3>
            <p className="text-surface-400">There are currently no {filter !== 'all' ? filter : ''} applications in the pipeline.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredApps.map(app => (
              <div key={app._id} className="glass-card flex flex-col border border-white/5 hover:border-white/10 transition-colors">
                {/* Header Profile Section */}
                <div className="p-6 border-b border-white/5 flex gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 shrink-0 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-500/20">
                    {app.partner?.user?.avatar ? (
                      <img src={app.partner.user.avatar} alt="avatar" className="w-full h-full rounded-2xl object-cover" />
                    ) : (
                      app.partner?.user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-white truncate">{app.partner?.user?.name}</h3>
                        <p className="text-surface-400 text-sm">{app.partner?.user?.email}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider shrink-0 ${
                        app.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        app.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {app.partner?.skills?.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-surface-800 text-[11px] rounded-md text-surface-200 border border-white/5">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4 bg-surface-900/30">
                  <div>
                    <div className="flex items-center gap-2 text-surface-400 text-xs uppercase tracking-wider font-bold mb-1">
                      <HiOutlineBriefcase className="w-4 h-4" /> Type & Exp
                    </div>
                    <p className="text-white text-sm capitalize">{app.partner?.type} • {app.experienceYears || 0} yrs</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-surface-400 text-xs uppercase tracking-wider font-bold mb-1">
                      <HiOutlineCurrencyDollar className="w-4 h-4" /> Expected Rate
                    </div>
                    <p className="text-white text-sm">${app.expectedHourlyRate || 0} / hr</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-surface-400 text-xs uppercase tracking-wider font-bold mb-1">
                      <HiOutlineClock className="w-4 h-4" /> Availability
                    </div>
                    <p className="text-white text-sm capitalize">{app.availability ? app.availability.replace('-', ' ') : 'Not specified'}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a href={app.portfolioLink} target="_blank" rel="noreferrer" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 transition-colors w-fit">
                      <HiOutlineExternalLink /> View Portfolio
                    </a>
                    {app.linkedinUrl && (
                      <a href={app.linkedinUrl} target="_blank" rel="noreferrer" className="text-[#0a66c2] hover:text-[#004182] text-sm flex items-center gap-1 transition-colors w-fit">
                        <HiOutlineExternalLink /> LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>

                {/* Cover Letter Section */}
                <div className="p-6 flex-1">
                  <p className="text-xs uppercase tracking-wider font-bold text-surface-400 mb-2">Cover Letter</p>
                  <p className="text-surface-300 text-sm italic border-l-2 border-primary-500/50 pl-4 py-1 line-clamp-3 hover:line-clamp-none transition-all">
                    "{app.coverLetter}"
                  </p>
                </div>
                
                {/* Actions Footer */}
                {app.status === 'pending' && (
                  <div className="p-4 border-t border-white/5 bg-surface-800/50 flex gap-3 justify-end mt-auto rounded-b-2xl">
                    <button 
                      onClick={() => setActionModal({ isOpen: true, type: 'rejected', application: app })} 
                      className="px-4 py-2 bg-surface-800 hover:bg-red-500/10 text-red-400 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                    >
                      <HiOutlineX /> Reject
                    </button>
                    <button 
                      onClick={() => setActionModal({ isOpen: true, type: 'approved', application: app })} 
                      className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                    >
                      <HiOutlineCheck /> Approve & Onboard
                    </button>
                  </div>
                )}
                {app.status !== 'pending' && app.reviewNotes && (
                   <div className="p-4 border-t border-white/5 bg-surface-800/50 mt-auto rounded-b-2xl">
                     <p className="text-xs text-surface-400"><span className="font-bold text-white">Review Note:</span> {app.reviewNotes}</p>
                   </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className={`p-6 border-b border-white/5 ${actionModal.type === 'approved' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
              <h3 className={`text-xl font-bold ${actionModal.type === 'approved' ? 'text-emerald-400' : 'text-red-400'}`}>
                {actionModal.type === 'approved' ? 'Approve' : 'Reject'} {actionModal.application?.partner?.user?.name}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              {actionModal.type === 'approved' && (
                <div>
                  <label className="block text-sm font-medium text-surface-200 mb-2">Commission Rate (%)</label>
                  <p className="text-xs text-surface-400 mb-2">Set the percentage of gross project revenue this partner will receive.</p>
                  <input 
                    type="number" 
                    value={actionData.commissionRate}
                    onChange={e => setActionData({...actionData, commissionRate: e.target.value})}
                    className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-surface-200 mb-2">Review Notes (Optional)</label>
                <textarea 
                  rows="3"
                  placeholder="Internal notes for this decision..."
                  value={actionData.reviewNotes}
                  onChange={e => setActionData({...actionData, reviewNotes: e.target.value})}
                  className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 resize-none"
                ></textarea>
              </div>
            </div>

            <div className="p-4 border-t border-white/5 bg-surface-800 flex gap-3 justify-end">
              <button 
                onClick={() => setActionModal({ isOpen: false, type: '', application: null })}
                className="px-4 py-2 text-surface-300 hover:text-white transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={submitAction}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors text-white ${
                  actionModal.type === 'approved' ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-red-500 hover:bg-red-400'
                }`}
              >
                Confirm {actionModal.type === 'approved' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPartners;
