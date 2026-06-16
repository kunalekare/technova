import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiBriefcase, HiX, HiPlus, HiPencil, HiTrash, HiCheckCircle } from 'react-icons/hi';
import api from '../../services/api';

const AdminInternships = () => {
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showInternshipModal, setShowInternshipModal] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  
  const [showAppModal, setShowAppModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // Internship Form State
  const [internshipForm, setInternshipForm] = useState({
    title: '', company: 'TechNova', department: '', stipend: '',
    duration: '', mode: '', deadline: '', description: '',
    responsibilities: '', requirements: '', perks: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [internshipsRes, appsRes] = await Promise.all([
        api.get('/internships'),
        api.get('/internships/admin/applications')
      ]);
      setInternships(internshipsRes.data.data || []);
      setApplications(appsRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInternshipModal = (internship = null) => {
    if (internship) {
      setEditingInternship(internship);
      setInternshipForm({
        ...internship,
        responsibilities: internship.responsibilities?.join('\n') || '',
        requirements: internship.requirements?.join('\n') || '',
        perks: internship.perks?.join('\n') || ''
      });
    } else {
      setEditingInternship(null);
      setInternshipForm({
        title: '', company: 'TechNova', department: '', stipend: '',
        duration: '', mode: 'Remote', deadline: '', description: '',
        responsibilities: '', requirements: '', perks: ''
      });
    }
    setShowInternshipModal(true);
  };

  const saveInternship = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...internshipForm,
        responsibilities: internshipForm.responsibilities.split('\n').filter(Boolean),
        requirements: internshipForm.requirements.split('\n').filter(Boolean),
        perks: internshipForm.perks.split('\n').filter(Boolean),
        status: 'Active'
      };

      if (editingInternship) {
        await api.put(`/internships/${editingInternship._id}`, payload);
      } else {
        await api.post('/internships', payload);
      }
      setShowInternshipModal(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save internship:', error);
      alert('Error saving internship. Check console.');
    }
  };

  const closeInternship = async (id) => {
    if (window.confirm('Are you sure you want to close this internship? It will no longer be visible to applicants.')) {
      try {
        await api.delete(`/internships/${id}`);
        fetchData();
      } catch (error) {
        console.error('Failed to close internship:', error);
      }
    }
  };

  const handleOpenAppModal = (app) => {
    setSelectedApp(app);
    setShowAppModal(true);
  };

  const updateAppStatus = async (status) => {
    try {
      await api.put(`/internships/admin/applications/${selectedApp._id}/status`, { status });
      setSelectedApp({ ...selectedApp, status });
      fetchData(); // Refresh list silently
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <>
      <Helmet>
        <title>Internship Management | Admin Dashboard</title>
      </Helmet>

      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">Internships Management</h1>
          <p className="text-surface-400">Post new internships, edit listings, and review incoming applications.</p>
        </div>
        <button onClick={() => handleOpenInternshipModal()} className="btn-primary flex items-center gap-2">
          <HiPlus /> Post New Internship
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Active Internships */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Active Internships</h2>
          <div className="space-y-4">
            {internships.filter(i => i.status === 'Active').map((internship, i) => (
              <motion.div 
                key={internship._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface-900 p-5 rounded-2xl border border-white/5 shadow-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-white text-lg">{internship.title}</h3>
                    <p className="text-sm text-surface-400">{internship.department}</p>
                  </div>
                  <span className="badge-primary !bg-emerald-500/10 !text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-surface-300 mb-4">
                  <p>Stipend: <span className="text-white font-medium">{internship.stipend || 'Unpaid'}</span></p>
                  <p>Mode: <span className="text-white font-medium">{internship.mode}</span></p>
                  <p>Duration: <span className="text-white font-medium">{internship.duration}</span></p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenInternshipModal(internship)} className="flex-1 py-2 bg-surface-800 text-surface-300 rounded-lg hover:bg-surface-700 transition-colors flex justify-center items-center gap-2 text-sm font-medium">
                    <HiPencil className="w-4 h-4"/> Edit Listing
                  </button>
                  <button onClick={() => closeInternship(internship._id)} className="flex-1 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex justify-center items-center gap-2 text-sm font-medium">
                    <HiTrash className="w-4 h-4"/> Close Internship
                  </button>
                </div>
              </motion.div>
            ))}
            {internships.filter(i => i.status === 'Active').length === 0 && (
              <div className="bg-surface-900 border border-white/5 rounded-2xl p-8 text-center text-surface-400">
                No active internships. Post a new one!
              </div>
            )}
          </div>
        </div>

        {/* Student Applications */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Recent Applications</h2>
          <div className="space-y-4">
            {applications.map((app, i) => (
              <motion.div 
                key={app._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface-900 p-5 rounded-2xl border border-white/5 shadow-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-white text-lg">{app.applicant?.name || 'Unknown User'}</h3>
                    <p className="text-sm text-primary-400">for {app.internship?.title}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-md border ${
                    app.status === 'Pending Review' || app.status === 'Applied' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                    app.status === 'Interviewing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    app.status === 'Selected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-sm text-surface-400 mb-4">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                <button onClick={() => handleOpenAppModal(app)} className="btn-secondary w-full py-2 text-sm">Review Candidate</button>
              </motion.div>
            ))}
            {applications.length === 0 && (
              <div className="bg-surface-900 border border-white/5 rounded-2xl p-8 text-center text-surface-400">
                No applications yet.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Post/Edit Internship Modal */}
      {showInternshipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowInternshipModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-900 border border-white/10 rounded-3xl p-6 w-full max-w-3xl relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl"
          >
            <button onClick={() => setShowInternshipModal(false)} className="absolute top-6 right-6 text-surface-400 hover:text-white transition-colors">
              <HiX className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">{editingInternship ? 'Edit Internship' : 'Post New Internship'}</h2>
            
            <form onSubmit={saveInternship} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Internship Title</label>
                  <input required type="text" value={internshipForm.title} onChange={e => setInternshipForm({...internshipForm, title: e.target.value})} className="input-field" placeholder="e.g. Frontend React Intern" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Company/Entity</label>
                  <input required type="text" value={internshipForm.company} onChange={e => setInternshipForm({...internshipForm, company: e.target.value})} className="input-field" placeholder="e.g. TechNova" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Department</label>
                  <input required type="text" value={internshipForm.department} onChange={e => setInternshipForm({...internshipForm, department: e.target.value})} className="input-field" placeholder="e.g. Engineering" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Stipend</label>
                  <input type="text" value={internshipForm.stipend} onChange={e => setInternshipForm({...internshipForm, stipend: e.target.value})} className="input-field" placeholder="e.g. ₹15,000 / month or Unpaid" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Duration</label>
                  <input required type="text" value={internshipForm.duration} onChange={e => setInternshipForm({...internshipForm, duration: e.target.value})} className="input-field" placeholder="e.g. 3 Months" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Work Mode</label>
                  <select required value={internshipForm.mode} onChange={e => setInternshipForm({...internshipForm, mode: e.target.value})} className="input-field">
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-surface-300 mb-1">Application Deadline</label>
                  <input required type="date" value={internshipForm.deadline ? new Date(internshipForm.deadline).toISOString().split('T')[0] : ''} onChange={e => setInternshipForm({...internshipForm, deadline: e.target.value})} className="input-field" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-surface-300 mb-1">Description</label>
                  <textarea required value={internshipForm.description} onChange={e => setInternshipForm({...internshipForm, description: e.target.value})} rows="3" className="input-field resize-none" placeholder="Overview of the internship..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-surface-300 mb-1">Responsibilities (One per line)</label>
                  <textarea value={internshipForm.responsibilities} onChange={e => setInternshipForm({...internshipForm, responsibilities: e.target.value})} rows="4" className="input-field resize-none" placeholder="Develop features...&#10;Fix bugs..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-surface-300 mb-1">Requirements/Who can apply (One per line)</label>
                  <textarea value={internshipForm.requirements} onChange={e => setInternshipForm({...internshipForm, requirements: e.target.value})} rows="4" className="input-field resize-none" placeholder="React knowledge...&#10;Currently in 3rd year..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-surface-300 mb-1">Perks (One per line)</label>
                  <textarea value={internshipForm.perks} onChange={e => setInternshipForm({...internshipForm, perks: e.target.value})} rows="3" className="input-field resize-none" placeholder="Certificate...&#10;Letter of Recommendation..."></textarea>
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-3">{editingInternship ? 'Save Changes' : 'Publish Internship'}</button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Review Candidate Modal */}
      {showAppModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAppModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-900 border border-white/10 rounded-3xl p-6 w-full max-w-3xl relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl"
          >
            <button onClick={() => setShowAppModal(false)} className="absolute top-6 right-6 text-surface-400 hover:text-white transition-colors">
              <HiX className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-2">Review Internship Application</h2>
            <p className="text-surface-400 mb-6 border-b border-white/5 pb-6">Candidate: <span className="text-white font-medium">{selectedApp.applicant?.name}</span> for <span className="text-white font-medium">{selectedApp.internship?.title}</span></p>

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
                  <h4 className="text-sm font-medium text-surface-500 mb-1 uppercase tracking-wider">University/College</h4>
                  <p className="text-white">{selectedApp.universityName || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-surface-500 mb-1 uppercase tracking-wider">Major/Degree</h4>
                  <p className="text-white">{selectedApp.majorOrDegree || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-surface-500 mb-1 uppercase tracking-wider">Graduation Year</h4>
                  <p className="text-white">{selectedApp.expectedGraduation || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-surface-500 mb-1 uppercase tracking-wider">Availability</h4>
                  <p className="text-white">{selectedApp.availability || 'N/A'}</p>
                </div>
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
                <button onClick={() => updateAppStatus('Pending Review')} className={`py-2 rounded-xl text-sm font-medium border transition-colors ${selectedApp.status === 'Pending Review' || selectedApp.status === 'Applied' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'bg-surface-800 text-surface-400 border-transparent hover:bg-surface-700'}`}>Pending</button>
                <button onClick={() => updateAppStatus('Interviewing')} className={`py-2 rounded-xl text-sm font-medium border transition-colors ${selectedApp.status === 'Interviewing' || selectedApp.status === 'Shortlisted' || selectedApp.status === 'Interview Scheduled' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-surface-800 text-surface-400 border-transparent hover:bg-surface-700'}`}>Interviewing</button>
                <button onClick={() => updateAppStatus('Selected')} className={`py-2 rounded-xl text-sm font-medium border transition-colors ${selectedApp.status === 'Selected' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-surface-800 text-surface-400 border-transparent hover:bg-surface-700'}`}>Selected</button>
                <button onClick={() => updateAppStatus('Rejected')} className={`py-2 rounded-xl text-sm font-medium border transition-colors ${selectedApp.status === 'Rejected' ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-surface-800 text-surface-400 border-transparent hover:bg-surface-700'}`}>Rejected</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AdminInternships;
