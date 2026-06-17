import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBriefcase, HiClock, HiDocumentText, HiOutlineOfficeBuilding, HiOutlineChevronRight, HiX, HiLink, HiOutlineDownload } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const MyJobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const { data } = await api.get('/jobs/my-applications');
        setApplications(data.data || []);
      } catch (err) {
        toast.error('Failed to load your job applications');
      } finally {
        setLoading(false);
      }
    };
    fetchMyApplications();
  }, []);
  return (
    <>
      <Helmet>
        <title>Job Applications | Velixora</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header section with glow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-surface-900/50 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-inner">
              <HiBriefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">Job Applications</h1>
              <p className="text-surface-400 mt-1">Track your career journey and interview pipelines.</p>
            </div>
          </div>
          <Link to="/careers" className="btn-primary relative z-10 !px-8 !py-4 shadow-lg shadow-primary-500/20 flex items-center gap-2 text-base">
            Browse Opportunities <HiOutlineChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Application Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-full p-12 text-center text-surface-400">Loading your applications...</div>
          ) : applications.map((app, i) => {
            const color = app.status === 'accepted' ? 'emerald' : app.status === 'rejected' ? 'red' : 'purple';
            const progress = app.status === 'accepted' ? 100 : app.status === 'reviewed' ? 60 : 30;
            return (
            <motion.div 
              key={app._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-3xl border border-white/5 relative group hover:border-white/10 hover:bg-surface-800/80 transition-all duration-500 overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-40 h-40 bg-${color}-500/10 rounded-full blur-[60px] group-hover:bg-${color}-500/20 transition-colors duration-500`} />
              
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center border border-${color}-500/20 shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <HiOutlineOfficeBuilding className={`w-6 h-6 text-${color}-400`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors line-clamp-1">{app.job?.title || 'Unknown Job'}</h3>
                    <p className="text-sm text-surface-400 mt-1 font-medium">{app.job?.department || 'Velixora'}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-black tracking-widest rounded-lg border uppercase w-fit bg-${color}-500/10 text-${color}-400 border-${color}-500/20`}>
                  {app.status || 'Pending'}
                </span>
              </div>

              {/* Animated Progress Bar */}
              <div className="mb-8 relative z-10">
                <div className="flex justify-between text-xs text-surface-400 mb-2 font-medium">
                  <span>Application Submitted</span>
                  <span>Offer</span>
                </div>
                <div className="h-2 w-full bg-surface-900 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full bg-gradient-to-r from-primary-500 to-${color}-400 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)] relative`}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 relative z-10 p-4 bg-surface-900/50 rounded-2xl border border-white/5">
                <div>
                  <p className="text-xs font-bold text-surface-500 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider"><HiClock className="w-4 h-4 text-surface-400" /> Applied On</p>
                  <p className="text-sm text-white font-medium">{new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-surface-500 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider"><HiDocumentText className="w-4 h-4 text-primary-400" /> Status</p>
                  <p className="text-sm text-primary-300 font-bold capitalize">{app.status || 'Pending Review'}</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedApp(app)}
                className="w-full relative z-10 py-3.5 bg-surface-800 hover:bg-surface-700 text-white font-bold rounded-xl border border-white/10 hover:border-primary-500/50 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
              >
                View Detailed Status
                <HiOutlineChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          );
          })}

          {!loading && applications.length === 0 && (
            <div className="col-span-full glass-card p-20 text-center rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px]" />
              <div className="w-24 h-24 bg-surface-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 relative z-10 border border-white/5 rotate-3">
                <HiBriefcase className="w-12 h-12 text-surface-500 -rotate-3" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white relative z-10">No Active Applications</h3>
              <p className="text-surface-400 mt-2 max-w-sm mx-auto relative z-10">You haven't applied to any positions yet. Explore our open roles and join the team.</p>
              <Link to="/careers" className="mt-8 btn-primary inline-flex relative z-10 shadow-lg shadow-primary-500/20 px-8 py-4 text-lg">
                View Open Positions
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Status Modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div key="modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setSelectedApp(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-900 border border-white/10 rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-surface-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
                    <HiOutlineOfficeBuilding className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedApp.job?.title || 'Unknown Job'}</h3>
                    <p className="text-sm text-surface-400">{selectedApp.job?.department || 'Velixora'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="w-10 h-10 rounded-full bg-surface-800 flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-700 transition-colors"
                >
                  <HiX className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                
                {/* Status Banner */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                  selectedApp.status === 'Hired' || selectedApp.status === 'Offered' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                  selectedApp.status === 'Rejected' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                  selectedApp.status === 'Interviewing' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                  'bg-primary-500/10 border-primary-500/20 text-primary-400'
                }`}>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">Current Status</p>
                    <p className="text-lg font-bold">{selectedApp.status || 'Pending Review'}</p>
                  </div>
                  <HiBriefcase className="w-8 h-8 opacity-50" />
                </div>

                {/* Recruiter Feedback */}
                {selectedApp.adminFeedback && (
                  <div>
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <HiDocumentText className="text-primary-400" /> Recruiter Feedback
                    </h4>
                    <div className="bg-surface-800/50 p-4 rounded-xl border border-white/5 text-sm text-surface-300 leading-relaxed">
                      {selectedApp.adminFeedback}
                    </div>
                  </div>
                )}

                {/* Application Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-surface-800/30 p-4 rounded-xl border border-white/5">
                    <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">Applied On</p>
                    <p className="text-sm text-white font-medium">{new Date(selectedApp.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-surface-800/30 p-4 rounded-xl border border-white/5">
                    <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">Expected Salary</p>
                    <p className="text-sm text-white font-medium">{selectedApp.expectedSalary || 'Not specified'}</p>
                  </div>
                  <div className="bg-surface-800/30 p-4 rounded-xl border border-white/5">
                    <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">Notice Period</p>
                    <p className="text-sm text-white font-medium">{selectedApp.noticePeriod || 'Not specified'}</p>
                  </div>
                  <div className="bg-surface-800/30 p-4 rounded-xl border border-white/5">
                    <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">Experience</p>
                    <p className="text-sm text-white font-medium">{selectedApp.experienceYears || 'Not specified'}</p>
                  </div>
                </div>

                {/* Submitted Links */}
                <div>
                  <h4 className="text-sm font-bold text-white mb-3">Submitted Materials</h4>
                  <div className="space-y-2">
                    {selectedApp.resumeUrl && (
                      <a href={selectedApp.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-surface-800 hover:bg-surface-700 border border-white/5 rounded-xl transition-colors group">
                        <span className="flex items-center gap-3 text-sm font-medium text-white">
                          <HiDocumentText className="w-5 h-5 text-primary-400" /> Resume / CV
                        </span>
                        <HiOutlineDownload className="w-5 h-5 text-surface-400 group-hover:text-primary-400 transition-colors" />
                      </a>
                    )}
                    {selectedApp.linkedInUrl && (
                      <a href={selectedApp.linkedInUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-surface-800 hover:bg-surface-700 border border-white/5 rounded-xl transition-colors group">
                        <span className="flex items-center gap-3 text-sm font-medium text-white">
                          <HiLink className="w-5 h-5 text-blue-400" /> LinkedIn Profile
                        </span>
                        <HiOutlineChevronRight className="w-5 h-5 text-surface-400 group-hover:text-blue-400 transition-colors" />
                      </a>
                    )}
                    {selectedApp.githubOrPortfolioUrl && (
                      <a href={selectedApp.githubOrPortfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-surface-800 hover:bg-surface-700 border border-white/5 rounded-xl transition-colors group">
                        <span className="flex items-center gap-3 text-sm font-medium text-white">
                          <HiLink className="w-5 h-5 text-purple-400" /> Portfolio / GitHub
                        </span>
                        <HiOutlineChevronRight className="w-5 h-5 text-surface-400 group-hover:text-purple-400 transition-colors" />
                      </a>
                    )}
                  </div>
                </div>
                
                {selectedApp.coverLetter && (
                  <div>
                    <h4 className="text-sm font-bold text-white mb-3">Cover Letter / Message</h4>
                    <div className="bg-surface-800/30 p-4 rounded-xl border border-white/5 text-sm text-surface-300 leading-relaxed whitespace-pre-wrap">
                      {selectedApp.coverLetter}
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MyJobApplications;
