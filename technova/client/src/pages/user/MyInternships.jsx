import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBriefcase, HiClock, HiDocumentText, HiOutlineAcademicCap, HiOutlineChevronRight, HiSparkles, HiX, HiLink, HiOutlineDownload } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const MyInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchMyInternships = async () => {
      try {
        const { data } = await api.get('/internships/my-applications');
        setInternships(data.data || []);
      } catch (err) {
        toast.error('Failed to load your internship applications');
      } finally {
        setLoading(false);
      }
    };
    fetchMyInternships();
  }, []);
  return (
    <>
      <Helmet>
        <title>My Internships | Velixora Dashboard</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header section with glow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-surface-900/50 p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-inner">
              <HiOutlineAcademicCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">My Internships</h1>
              <p className="text-surface-400 mt-1">Track your internship applications and active programs.</p>
            </div>
          </div>
          <Link to="/internships" className="btn-primary relative z-10 !px-8 !py-4 shadow-lg shadow-primary-500/20 flex items-center gap-2 text-base">
            Find Internships <HiOutlineChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Internships Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-full p-12 text-center text-surface-400">Loading your applications...</div>
          ) : internships.map((app, i) => {
            const color = app.status === 'accepted' ? 'emerald' : app.status === 'rejected' ? 'red' : 'purple';
            const progress = app.status === 'accepted' ? 100 : app.status === 'reviewed' ? 60 : 30;
            return (
            <motion.div 
              key={app._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 relative group hover:border-white/10 hover:bg-surface-800/80 transition-all duration-500 overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-40 h-40 bg-${color}-500/10 rounded-full blur-[60px] group-hover:bg-${color}-500/20 transition-colors duration-500`} />
              
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center border border-${color}-500/20 shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <HiOutlineAcademicCap className={`w-6 h-6 text-${color}-400`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors line-clamp-1">{app.internship?.title || 'Unknown Internship'}</h3>
                    <p className="text-sm text-surface-400 mt-1 font-medium">{app.internship?.company || 'Velixora'}</p>
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
                  <span>Offer Extended</span>
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

              <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                <button 
                  onClick={() => setSelectedApp(app)}
                  className="w-full sm:flex-1 py-3.5 bg-surface-800 hover:bg-surface-700 text-white font-bold rounded-xl border border-white/10 hover:border-primary-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  View Status
                </button>
                {app.status === 'accepted' && (
                  <button className="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl border border-white/10 shadow-lg shadow-emerald-500/25 transition-all duration-300 flex items-center justify-center gap-2">
                    <HiSparkles className="w-5 h-5" />
                    Intern Dashboard
                  </button>
                )}
              </div>
            </motion.div>
          );
          })}

          {!loading && internships.length === 0 && (
            <div className="col-span-full glass-card p-20 text-center rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px]" />
              <div className="w-24 h-24 bg-surface-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 relative z-10 border border-white/5 rotate-3">
                <HiOutlineAcademicCap className="w-12 h-12 text-surface-500 -rotate-3" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white relative z-10">No Active Internships</h3>
              <p className="text-surface-400 mt-2 max-w-sm mx-auto relative z-10">You haven't applied to any internships yet. Start your journey by exploring our student programs.</p>
              <Link to="/internships" className="mt-8 btn-primary inline-flex relative z-10 shadow-lg shadow-primary-500/20 px-8 py-4 text-lg">
                Explore Programs
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
                    <HiOutlineAcademicCap className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedApp.internship?.title || 'Unknown Internship'}</h3>
                    <p className="text-sm text-surface-400">{selectedApp.internship?.company || 'Velixora'}</p>
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
                    <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">Phone Number</p>
                    <p className="text-sm text-white font-medium">{selectedApp.phone || 'Not specified'}</p>
                  </div>
                  <div className="bg-surface-800/30 p-4 rounded-xl border border-white/5">
                    <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">University / College</p>
                    <p className="text-sm text-white font-medium">{selectedApp.universityName || 'Not specified'}</p>
                  </div>
                  <div className="bg-surface-800/30 p-4 rounded-xl border border-white/5">
                    <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">Major / Degree</p>
                    <p className="text-sm text-white font-medium">{selectedApp.majorOrDegree || 'Not specified'}</p>
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

export default MyInternships;
