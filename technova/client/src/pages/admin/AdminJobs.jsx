import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiBriefcase, HiX, HiCurrencyDollar, HiLocationMarker, 
  HiOutlineUserGroup, HiPlus, HiPencilAlt, HiTrash, HiOutlineUser,
  HiOutlineMail, HiOutlinePhone, HiOutlineOfficeBuilding, HiOutlineAcademicCap,
  HiOutlineClock
} from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showJobModal, setShowJobModal] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // Job Form state
  const initialJobForm = {
    title: '', department: 'Engineering', description: '',
    salaryRange: '', type: 'Full-time', mode: 'Remote', location: '',
    responsibilities: '', requirements: '', benefits: ''
  };
  const [jobForm, setJobForm] = useState(initialJobForm);
  const [editingJobId, setEditingJobId] = useState(null);
  const [jobSubmitStatus, setJobSubmitStatus] = useState('idle');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/jobs'),
        api.get('/jobs/admin/applications')
      ]);
      setJobs(jobsRes.data.data);
      setApplications(appsRes.data.data);
    } catch (err) {
      toast.error('Failed to load jobs data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostOrEditJob = async (e) => {
    e.preventDefault();
    setJobSubmitStatus('loading');
    
    const formattedData = {
      ...jobForm,
      responsibilities: jobForm.responsibilities.split('\n').filter(i => i.trim() !== ''),
      requirements: jobForm.requirements.split('\n').filter(i => i.trim() !== ''),
      benefits: jobForm.benefits.split('\n').filter(i => i.trim() !== ''),
    };

    try {
      if (editingJobId) {
        await api.put(`/jobs/${editingJobId}`, formattedData);
        toast.success('Job listing updated successfully');
      } else {
        await api.post('/jobs', formattedData);
        toast.success('New job listing published');
      }
      setShowJobModal(false);
      setJobForm(initialJobForm);
      setEditingJobId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save job listing');
    } finally {
      setJobSubmitStatus('idle');
    }
  };

  const openEditModal = (job) => {
    setJobForm({
      ...job,
      responsibilities: job.responsibilities.join('\n'),
      requirements: job.requirements.join('\n'),
      benefits: job.benefits.join('\n'),
    });
    setEditingJobId(job._id);
    setShowJobModal(true);
  };

  const closeJob = async (id) => {
    if(window.confirm('Are you sure you want to permanently delete this job listing?')) {
      try {
        await api.delete(`/jobs/${id}`);
        toast.success('Job listing deleted');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete job');
      }
    }
  };

  const updateAppStatus = async (status) => {
    try {
      await api.put(`/jobs/admin/applications/${selectedApp._id}/status`, { status });
      toast.success(`Application marked as ${status}`);
      setShowAppModal(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <>
      <Helmet>
        <title>Jobs Management — Admin | TechNova</title>
      </Helmet>

      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Jobs Management</h1>
            <p className="text-surface-400 text-sm mt-1">Post open positions, manage listings, and review incoming candidates.</p>
          </div>
          <button 
            onClick={() => { setJobForm(initialJobForm); setEditingJobId(null); setShowJobModal(true); }} 
            className="btn-primary shadow-lg shadow-primary-500/20"
          >
            <HiPlus className="w-5 h-5 mr-1.5" /> Post New Job
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-40 glass-card animate-pulse"></div>
              <div className="h-40 glass-card animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 glass-card animate-pulse"></div>
              <div className="h-32 glass-card animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Column: Active Jobs */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="p-2 bg-primary-500/10 rounded-lg text-primary-400">
                  <HiBriefcase className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-display font-bold text-white">Active Listings</h2>
                <span className="ml-auto bg-surface-800 text-surface-400 text-xs font-bold px-2.5 py-1 rounded-full">{jobs.length}</span>
              </div>
              
              <div className="space-y-4">
                {jobs.length === 0 ? (
                  <div className="text-center py-12 glass-card rounded-2xl border-dashed">
                    <HiBriefcase className="w-12 h-12 text-surface-600 mx-auto mb-3" />
                    <p className="text-surface-400">No active job listings.</p>
                    <button onClick={() => setShowJobModal(true)} className="text-primary-400 text-sm font-medium mt-2 hover:underline">Create your first job post</button>
                  </div>
                ) : jobs.map((job, i) => (
                  <motion.div 
                    key={job._id}
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="glass-card p-6 overflow-hidden relative group hover:border-white/10 transition-colors"
                  >
                    {/* Active Indicator Line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-400 to-accent-500" />
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-white text-xl mb-1">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-surface-400">
                          <span className="text-primary-300 font-medium">{job.department}</span>
                          <span>•</span>
                          <span className="flex items-center"><HiLocationMarker className="w-4 h-4 mr-1 opacity-70" /> {job.mode}</span>
                          <span>•</span>
                          <span>{job.type}</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span> Active
                      </span>
                    </div>

                    <div className="flex items-center gap-6 mb-6 pt-4 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-xs text-surface-500 uppercase tracking-wider mb-1">Applicants</span>
                        <div className="flex items-center text-white">
                          <HiOutlineUserGroup className="w-5 h-5 mr-2 text-surface-400" />
                          <span className="font-bold text-lg">{applications.filter(a => a.job?._id === job._id).length}</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-surface-500 uppercase tracking-wider mb-1">Salary Range</span>
                        <div className="flex items-center text-white">
                          <HiCurrencyDollar className="w-5 h-5 mr-1.5 text-emerald-400" />
                          <span className="font-medium">{job.salaryRange || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => openEditModal(job)} className="flex-1 flex justify-center items-center py-2.5 text-sm font-medium bg-surface-800 hover:bg-surface-700 text-white rounded-xl transition-colors border border-white/5 hover:border-white/10">
                        <HiPencilAlt className="w-4 h-4 mr-2" /> Edit Details
                      </button>
                      <button onClick={() => closeJob(job._id)} className="flex-1 flex justify-center items-center py-2.5 text-sm font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors border border-red-500/10">
                        <HiTrash className="w-4 h-4 mr-2" /> Close Job
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column: Applications */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="p-2 bg-accent-500/10 rounded-lg text-accent-400">
                  <HiOutlineUserGroup className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-display font-bold text-white">Recent Applications</h2>
                <span className="ml-auto bg-surface-800 text-surface-400 text-xs font-bold px-2.5 py-1 rounded-full">{applications.length}</span>
              </div>
              
              <div className="space-y-4">
                {applications.length === 0 ? (
                  <div className="text-center py-12 glass-card rounded-2xl border-dashed">
                    <HiOutlineUser className="w-12 h-12 text-surface-600 mx-auto mb-3" />
                    <p className="text-surface-400">No applications received yet.</p>
                  </div>
                ) : applications.map((app, i) => (
                  <motion.div 
                    key={app._id}
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="glass-card p-5 hover:border-white/10 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-white text-lg truncate">{app.applicant?.name || 'Unknown Candidate'}</h3>
                        <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          app.status === 'Pending Review' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          app.status === 'Interviewing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          app.status === 'Hired' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-surface-400 truncate flex items-center">
                        <span className="text-surface-500 mr-2">Applied for:</span> 
                        <span className="text-primary-300 font-medium">{app.job?.title || 'Unknown Role'}</span>
                      </p>
                      <p className="text-xs text-surface-500 mt-2 flex items-center">
                        <HiOutlineClock className="w-3.5 h-3.5 mr-1" /> {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => { setSelectedApp(app); setShowAppModal(true); }} 
                      className="w-full sm:w-auto shrink-0 px-5 py-2.5 text-sm font-medium bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors shadow-lg shadow-primary-500/20"
                    >
                      Review
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Post/Edit Job Modal */}
      <AnimatePresence>
        {showJobModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setShowJobModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-900 border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-3xl relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl"
            >
              <button onClick={() => setShowJobModal(false)} className="absolute top-6 right-6 p-2 bg-surface-800 hover:bg-surface-700 text-surface-400 hover:text-white rounded-full transition-colors"><HiX className="w-5 h-5" /></button>
              
              <div className="mb-8">
                <h2 className="text-2xl font-display font-bold text-white">{editingJobId ? 'Edit Job Listing' : 'Post New Job'}</h2>
                <p className="text-surface-400 text-sm mt-1">Fill out the details below to attract top talent.</p>
              </div>
              
              <form onSubmit={handlePostOrEditJob} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Job Title</label>
                    <input type="text" required value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary-500 outline-none transition-colors" placeholder="e.g. Senior Frontend Engineer" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Department</label>
                    <select value={jobForm.department} onChange={e => setJobForm({...jobForm, department: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary-500 outline-none transition-colors appearance-none cursor-pointer">
                      <option value="Engineering">Engineering</option><option value="Design">Design</option>
                      <option value="Marketing">Marketing</option><option value="Product">Product</option><option value="Sales">Sales</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Salary Range</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500"><HiCurrencyDollar className="w-4 h-4" /></span>
                      <input type="text" value={jobForm.salaryRange} onChange={e => setJobForm({...jobForm, salaryRange: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-primary-500 outline-none transition-colors" placeholder="e.g. $100k - $150k" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Location</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500"><HiLocationMarker className="w-4 h-4" /></span>
                      <input type="text" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-primary-500 outline-none transition-colors" placeholder="e.g. New York, NY" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Job Type</label>
                    <select value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary-500 outline-none transition-colors appearance-none cursor-pointer">
                      <option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contract">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Work Mode</label>
                    <select value={jobForm.mode} onChange={e => setJobForm({...jobForm, mode: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary-500 outline-none transition-colors appearance-none cursor-pointer">
                      <option value="Remote">Remote</option><option value="Hybrid">Hybrid</option><option value="On-site">On-site</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Short Overview</label>
                  <textarea required value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} rows="3" className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors resize-none" placeholder="Briefly describe the role..."></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5 flex justify-between"><span>Responsibilities</span> <span className="text-surface-500 text-xs font-normal">One per line</span></label>
                  <textarea required value={jobForm.responsibilities} onChange={e => setJobForm({...jobForm, responsibilities: e.target.value})} rows="4" className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5 flex justify-between"><span>Requirements</span> <span className="text-surface-500 text-xs font-normal">One per line</span></label>
                  <textarea required value={jobForm.requirements} onChange={e => setJobForm({...jobForm, requirements: e.target.value})} rows="4" className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5 flex justify-between"><span>Benefits</span> <span className="text-surface-500 text-xs font-normal">One per line</span></label>
                  <textarea value={jobForm.benefits} onChange={e => setJobForm({...jobForm, benefits: e.target.value})} rows="3" className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors resize-none"></textarea>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-4">
                  <button type="button" onClick={() => setShowJobModal(false)} className="flex-1 py-3 px-4 bg-surface-800 hover:bg-surface-700 text-white rounded-xl font-medium transition-colors">Cancel</button>
                  <button type="submit" disabled={jobSubmitStatus === 'loading'} className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center justify-center">
                    {jobSubmitStatus === 'loading' ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : (editingJobId ? 'Save Changes' : 'Publish Job Post')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Application Review Modal */}
      <AnimatePresence>
        {showAppModal && selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setShowAppModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-900 border border-white/10 rounded-3xl w-full max-w-3xl relative z-10 shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Review Header */}
              <div className="p-6 sm:p-8 border-b border-white/5 flex items-start justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-white/10 rounded-2xl flex items-center justify-center">
                    <HiOutlineUser className="w-7 h-7 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedApp.applicant?.name}</h2>
                    <p className="text-surface-400 text-sm mt-0.5">Applied for <span className="text-primary-300 font-medium">{selectedApp.job?.title}</span></p>
                  </div>
                </div>
                <button onClick={() => setShowAppModal(false)} className="p-2 bg-surface-800 hover:bg-surface-700 text-surface-400 hover:text-white rounded-full transition-colors"><HiX className="w-5 h-5" /></button>
              </div>

              {/* Review Body */}
              <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar space-y-8">
                
                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-surface-800/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface-900 rounded-xl flex items-center justify-center shrink-0 text-surface-400"><HiOutlineMail className="w-5 h-5" /></div>
                    <div className="min-w-0">
                      <p className="text-xs text-surface-500 uppercase tracking-wider font-medium mb-0.5">Email Address</p>
                      <a href={`mailto:${selectedApp.applicant?.email}`} className="text-sm font-medium text-white hover:text-primary-400 truncate block">{selectedApp.applicant?.email}</a>
                    </div>
                  </div>
                  <div className="bg-surface-800/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface-900 rounded-xl flex items-center justify-center shrink-0 text-surface-400"><HiOutlinePhone className="w-5 h-5" /></div>
                    <div className="min-w-0">
                      <p className="text-xs text-surface-500 uppercase tracking-wider font-medium mb-0.5">Phone Number</p>
                      <p className="text-sm font-medium text-white truncate block">{selectedApp.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Profile Data */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Professional Profile</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                    <div>
                      <p className="text-sm text-surface-500 mb-1 flex items-center gap-1.5"><HiBriefcase className="w-4 h-4" /> Experience</p>
                      <p className="font-medium text-white">{selectedApp.experienceYears || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500 mb-1 flex items-center gap-1.5"><HiOutlineAcademicCap className="w-4 h-4" /> Education</p>
                      <p className="font-medium text-white">{selectedApp.education || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500 mb-1 flex items-center gap-1.5"><HiCurrencyDollar className="w-4 h-4" /> Expected Salary</p>
                      <p className="font-medium text-white">{selectedApp.expectedSalary || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-surface-500 mb-1 flex items-center gap-1.5"><HiOutlineOfficeBuilding className="w-4 h-4" /> Notice Period</p>
                      <p className="font-medium text-white">{selectedApp.noticePeriod || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-surface-500 mb-1">Current/Recent Company</p>
                      <p className="font-medium text-white">{selectedApp.currentCompany || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Links & Resumes</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedApp.resumeUrl && (
                      <a href={selectedApp.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-surface-800 border border-white/5 px-4 py-2.5 rounded-xl text-white hover:bg-surface-700 transition-colors text-sm font-medium">
                        View Resume PDF ↗
                      </a>
                    )}
                    {selectedApp.linkedInUrl && (
                      <a href={selectedApp.linkedInUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-[#0A66C2]/10 border border-[#0A66C2]/20 px-4 py-2.5 rounded-xl text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors text-sm font-medium">
                        LinkedIn Profile ↗
                      </a>
                    )}
                    {selectedApp.githubOrPortfolioUrl && (
                      <a href={selectedApp.githubOrPortfolioUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-surface-800 border border-white/5 px-4 py-2.5 rounded-xl text-white hover:bg-surface-700 transition-colors text-sm font-medium">
                        Portfolio / GitHub ↗
                      </a>
                    )}
                    {!selectedApp.resumeUrl && !selectedApp.linkedInUrl && !selectedApp.githubOrPortfolioUrl && (
                      <p className="text-surface-500 italic text-sm">No external links or documents provided.</p>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Cover Letter / Note</h3>
                  <div className="bg-surface-950 p-6 rounded-2xl border border-white/5 text-surface-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {selectedApp.coverLetter || <span className="italic opacity-60">No cover letter provided by the candidate.</span>}
                  </div>
                </div>

              </div>

              {/* Status Update Footer */}
              <div className="p-6 sm:p-8 border-t border-white/5 shrink-0 bg-surface-900 rounded-b-3xl">
                <h4 className="text-xs font-bold text-surface-500 mb-3 uppercase tracking-wider">Candidate Status Decision</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button onClick={() => updateAppStatus('Pending Review')} className={`py-2.5 rounded-xl text-sm font-bold tracking-wide border transition-all ${selectedApp.status === 'Pending Review' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-surface-800 text-surface-400 border-transparent hover:bg-surface-700'}`}>PENDING</button>
                  <button onClick={() => updateAppStatus('Interviewing')} className={`py-2.5 rounded-xl text-sm font-bold tracking-wide border transition-all ${selectedApp.status === 'Interviewing' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-surface-800 text-surface-400 border-transparent hover:bg-surface-700'}`}>INTERVIEW</button>
                  <button onClick={() => updateAppStatus('Hired')} className={`py-2.5 rounded-xl text-sm font-bold tracking-wide border transition-all ${selectedApp.status === 'Hired' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-surface-800 text-surface-400 border-transparent hover:bg-surface-700'}`}>HIRE</button>
                  <button onClick={() => updateAppStatus('Rejected')} className={`py-2.5 rounded-xl text-sm font-bold tracking-wide border transition-all ${selectedApp.status === 'Rejected' ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-surface-800 text-surface-400 border-transparent hover:bg-surface-700'}`}>REJECT</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminJobs;
