import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiBriefcase, HiX, HiCurrencyDollar, HiLocationMarker } from 'react-icons/hi';
import api from '../../services/api';

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostOrEditJob = async (e) => {
    e.preventDefault();
    setJobSubmitStatus('loading');
    
    // Convert comma/newline separated strings to arrays
    const formattedData = {
      ...jobForm,
      responsibilities: jobForm.responsibilities.split('\n').filter(i => i.trim() !== ''),
      requirements: jobForm.requirements.split('\n').filter(i => i.trim() !== ''),
      benefits: jobForm.benefits.split('\n').filter(i => i.trim() !== ''),
    };

    try {
      if (editingJobId) {
        await api.put(`/jobs/${editingJobId}`, formattedData);
      } else {
        await api.post('/jobs', formattedData);
      }
      setShowJobModal(false);
      setJobForm(initialJobForm);
      setEditingJobId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to save job');
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
    if(window.confirm('Are you sure you want to close/delete this job?')) {
      try {
        await api.delete(`/jobs/${id}`);
        fetchData();
      } catch (err) {
        alert('Failed to delete job');
      }
    }
  };

  const updateAppStatus = async (status) => {
    try {
      await api.put(`/jobs/admin/applications/${selectedApp._id}/status`, { status });
      setShowAppModal(false);
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <>
      <Helmet>
        <title>Jobs Management | Admin Dashboard</title>
      </Helmet>

      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">Jobs Management</h1>
          <p className="text-surface-400">Post open positions and review candidates.</p>
        </div>
        <button onClick={() => { setJobForm(initialJobForm); setEditingJobId(null); setShowJobModal(true); }} className="btn-primary">Post New Job</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Active Jobs */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><HiBriefcase className="text-primary-400" /> Active Listings</h2>
            <div className="space-y-4">
              {jobs.length === 0 ? (
                <p className="text-surface-400 italic">No active jobs found.</p>
              ) : jobs.map((job, i) => (
                <motion.div 
                  key={job._id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card p-5 border-l-4 border-l-primary-500 hover:border-l-accent-500 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-white text-lg">{job.title}</h3>
                      <p className="text-sm text-primary-400">{job.department} • {job.mode}</p>
                    </div>
                    <span className="badge-primary !bg-emerald-500/10 !text-emerald-400 border border-emerald-500/20">{job.status}</span>
                  </div>
                  <div className="text-sm text-surface-400 mb-4 flex items-center gap-4">
                    <span><span className="text-white font-bold">{applications.filter(a => a.job?._id === job._id).length}</span> Applicants</span>
                    <span>{job.type}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(job)} className="btn-secondary flex-1 py-2 text-sm border-white/5 bg-surface-800 hover:bg-surface-700">Edit Listing</button>
                    <button onClick={() => closeJob(job._id)} className="btn-secondary flex-1 py-2 text-sm border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20">Close Job</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Job Applications */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Recent Applications</h2>
            <div className="space-y-4">
              {applications.length === 0 ? (
                <p className="text-surface-400 italic">No applications found.</p>
              ) : applications.map((app, i) => (
                <motion.div 
                  key={app._id}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-white">{app.applicant?.name || 'Unknown'}</h3>
                      <p className="text-sm text-surface-400">for {app.job?.title || 'Unknown Job'}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      app.status === 'Pending Review' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                      app.status === 'Interviewing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      app.status === 'Hired' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-surface-400 mb-4">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                  <button onClick={() => { setSelectedApp(app); setShowAppModal(true); }} className="btn-primary w-full py-2 text-sm !rounded-xl">Review Candidate</button>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Post/Edit Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowJobModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-900 border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-3xl relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl"
          >
            <button onClick={() => setShowJobModal(false)} className="absolute top-6 right-6 text-surface-400 hover:text-white"><HiX className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold text-white mb-6">{editingJobId ? 'Edit Job Listing' : 'Post New Job'}</h2>
            
            <form onSubmit={handlePostOrEditJob} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Job Title</label>
                  <input type="text" required value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="input-field" placeholder="e.g. Senior Frontend Engineer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Department</label>
                  <select value={jobForm.department} onChange={e => setJobForm({...jobForm, department: e.target.value})} className="input-field">
                    <option value="Engineering">Engineering</option><option value="Design">Design</option>
                    <option value="Marketing">Marketing</option><option value="Product">Product</option><option value="Sales">Sales</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Salary Range</label>
                  <input type="text" value={jobForm.salaryRange} onChange={e => setJobForm({...jobForm, salaryRange: e.target.value})} className="input-field" placeholder="e.g. $100k - $150k" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Location</label>
                  <input type="text" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} className="input-field" placeholder="e.g. New York, NY" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Job Type</label>
                  <select value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})} className="input-field">
                    <option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Work Mode</label>
                  <select value={jobForm.mode} onChange={e => setJobForm({...jobForm, mode: e.target.value})} className="input-field">
                    <option value="Remote">Remote</option><option value="Hybrid">Hybrid</option><option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1">Description</label>
                <textarea required value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} rows="3" className="input-field resize-none"></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1">Responsibilities (One per line)</label>
                <textarea required value={jobForm.responsibilities} onChange={e => setJobForm({...jobForm, responsibilities: e.target.value})} rows="4" className="input-field resize-none"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1">Requirements (One per line)</label>
                <textarea required value={jobForm.requirements} onChange={e => setJobForm({...jobForm, requirements: e.target.value})} rows="4" className="input-field resize-none"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1">Benefits (One per line)</label>
                <textarea value={jobForm.benefits} onChange={e => setJobForm({...jobForm, benefits: e.target.value})} rows="3" className="input-field resize-none"></textarea>
              </div>

              <button type="submit" disabled={jobSubmitStatus === 'loading'} className="btn-primary w-full !py-3 !rounded-xl disabled:opacity-50">
                {jobSubmitStatus === 'loading' ? 'Saving...' : (editingJobId ? 'Update Job' : 'Publish Job')}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Application Review Modal */}
      {showAppModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAppModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-900 border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-2xl relative z-10 shadow-2xl"
          >
            <button onClick={() => setShowAppModal(false)} className="absolute top-6 right-6 text-surface-400 hover:text-white"><HiX className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold text-white mb-2">Review Application</h2>
            <p className="text-surface-400 mb-6 border-b border-white/5 pb-6">Candidate: <span className="text-white font-medium">{selectedApp.applicant?.name}</span> for <span className="text-white font-medium">{selectedApp.job?.title}</span></p>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-surface-500 mb-1 uppercase tracking-wider">Candidate Email</h4>
                  <a href={`mailto:${selectedApp.applicant?.email}`} className="text-primary-400 hover:text-primary-300 font-medium">{selectedApp.applicant?.email}</a>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-surface-500 mb-1 uppercase tracking-wider">Phone</h4>
                  <p className="text-white">{selectedApp.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-surface-500 mb-1 uppercase tracking-wider">Experience</h4>
                  <p className="text-white">{selectedApp.experienceYears || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-surface-500 mb-1 uppercase tracking-wider">Education</h4>
                  <p className="text-white">{selectedApp.education || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-surface-500 mb-1 uppercase tracking-wider">Expected Salary</h4>
                  <p className="text-white">{selectedApp.expectedSalary || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-surface-500 mb-1 uppercase tracking-wider">Notice Period</h4>
                  <p className="text-white">{selectedApp.noticePeriod || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-surface-500 mb-1 uppercase tracking-wider">Current / Recent Company</h4>
                <p className="text-white">{selectedApp.currentCompany || 'N/A'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-surface-500 mb-3 uppercase tracking-wider">Documents & Links</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedApp.resumeUrl && (
                    <a href={selectedApp.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-surface-800 border border-white/5 px-4 py-2 rounded-xl text-primary-400 hover:bg-surface-700 transition-colors text-sm font-medium">
                      View Resume ↗
                    </a>
                  )}
                  {selectedApp.linkedInUrl && (
                    <a href={selectedApp.linkedInUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#0A66C2]/10 border border-[#0A66C2]/20 px-4 py-2 rounded-xl text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors text-sm font-medium">
                      LinkedIn ↗
                    </a>
                  )}
                  {selectedApp.githubOrPortfolioUrl && (
                    <a href={selectedApp.githubOrPortfolioUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-surface-800 border border-white/5 px-4 py-2 rounded-xl text-white hover:bg-surface-700 transition-colors text-sm font-medium">
                      Portfolio/GitHub ↗
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-surface-500 mb-2 uppercase tracking-wider">Cover Letter / Note</h4>
                <div className="bg-surface-950 p-5 rounded-xl border border-white/5 text-surface-300 text-sm whitespace-pre-wrap leading-relaxed">
                  {selectedApp.coverLetter || 'No cover letter provided.'}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <h4 className="text-sm font-medium text-surface-500 mb-3 uppercase tracking-wider">Update Status</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button onClick={() => updateAppStatus('Pending Review')} className={`py-2 rounded-xl text-sm font-medium border transition-colors ${selectedApp.status === 'Pending Review' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'bg-surface-800 text-surface-400 border-transparent hover:bg-surface-700'}`}>Pending</button>
                <button onClick={() => updateAppStatus('Interviewing')} className={`py-2 rounded-xl text-sm font-medium border transition-colors ${selectedApp.status === 'Interviewing' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-surface-800 text-surface-400 border-transparent hover:bg-surface-700'}`}>Interviewing</button>
                <button onClick={() => updateAppStatus('Hired')} className={`py-2 rounded-xl text-sm font-medium border transition-colors ${selectedApp.status === 'Hired' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-surface-800 text-surface-400 border-transparent hover:bg-surface-700'}`}>Hired</button>
                <button onClick={() => updateAppStatus('Rejected')} className={`py-2 rounded-xl text-sm font-medium border transition-colors ${selectedApp.status === 'Rejected' ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-surface-800 text-surface-400 border-transparent hover:bg-surface-700'}`}>Rejected</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AdminJobs;
