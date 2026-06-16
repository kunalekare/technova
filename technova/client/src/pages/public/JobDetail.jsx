import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HiBriefcase, HiCurrencyDollar, HiLocationMarker, HiCheckCircle, HiX, HiArrowLeft } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import api from '../../services/api';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({ 
    phone: '', linkedInUrl: '', githubOrPortfolioUrl: '',
    experienceYears: '', education: '', currentCompany: '',
    expectedSalary: '', noticePeriod: '',
    resumeUrl: '', coverLetter: '' 
  });
  const [applyStatus, setApplyStatus] = useState('idle'); // idle, loading, success, error
  const [applyMessage, setApplyMessage] = useState('');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load job details. The job may no longer exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login', { state: { from: `/careers/${id}` } });
      return;
    }
    setShowApplyModal(true);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    setApplyStatus('loading');
    try {
      const res = await api.post(`/jobs/${id}/apply`, applyForm);
      if (res.data.success) {
        setApplyStatus('success');
        setApplyMessage('Application submitted successfully!');
        setTimeout(() => {
          setShowApplyModal(false);
          setApplyStatus('idle');
          navigate('/dashboard/jobs');
        }, 2000);
      }
    } catch (err) {
      setApplyStatus('error');
      setApplyMessage(err.response?.data?.message || 'Failed to submit application');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-white mb-4">Oops!</h2>
        <p className="text-surface-400 mb-6 text-center">{error}</p>
        <Link to="/careers" className="btn-secondary flex items-center gap-2">
          <HiArrowLeft /> Back to Careers
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{job.title} | Careers at TechNova</title>
      </Helmet>

      <div className="min-h-screen pt-24 pb-16 relative">
        {/* Background blobs */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-primary-500/10 blur-3xl rounded-full" />
        <div className="absolute top-60 right-10 w-96 h-96 bg-accent-500/10 blur-3xl rounded-full" />

        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <Link to="/careers" className="inline-flex items-center gap-2 text-surface-400 hover:text-white transition-colors mb-8 font-medium">
            <HiArrowLeft className="w-4 h-4" /> Back to open roles
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Main Content */}
            <div className="w-full lg:w-2/3 space-y-6">
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-900 border border-white/5 rounded-3xl p-8 md:p-10 shadow-xl">
                <div className="mb-8">
                  <h1 className="text-4xl font-display font-bold text-white mb-4 leading-tight">{job.title}</h1>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-xl text-sm font-semibold text-primary-400">
                      {job.department}
                    </span>
                    <span className="px-4 py-1.5 bg-surface-800 border border-white/5 rounded-xl text-sm font-semibold text-surface-300">
                      {job.type}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5 mb-8 bg-surface-950/50 rounded-2xl p-6">
                  <div>
                    <p className="text-xs text-surface-500 mb-2 font-medium uppercase tracking-wider">Salary Range</p>
                    <p className="text-white font-bold flex items-center gap-2"><HiCurrencyDollar className="text-emerald-400 w-5 h-5"/> {job.salaryRange || 'Competitive'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 mb-2 font-medium uppercase tracking-wider">Location</p>
                    <p className="text-white font-bold flex items-center gap-2"><HiLocationMarker className="text-purple-400 w-5 h-5"/> {job.mode} {job.location && <span className="text-surface-400 font-normal">({job.location})</span>}</p>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <h2 className="text-2xl font-bold text-white mb-4">About the Role</h2>
                  <p className="text-surface-300 leading-relaxed mb-8 text-lg">{job.description}</p>

                  <h2 className="text-2xl font-bold text-white mb-4">Responsibilities</h2>
                  <ul className="space-y-4 mb-8">
                    {job.responsibilities?.map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-surface-300 text-lg">
                        <div className="w-2 h-2 rounded-full bg-primary-400 mt-2.5 flex-shrink-0 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <h2 className="text-2xl font-bold text-white mb-4">Requirements</h2>
                  <ul className="space-y-4 mb-8">
                    {job.requirements?.map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-surface-300 text-lg">
                        <div className="w-2 h-2 rounded-full bg-accent-400 mt-2.5 flex-shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-surface-900 border border-white/5 rounded-3xl p-6 md:p-8 sticky top-28 shadow-xl">
                <button onClick={handleApplyClick} className="btn-primary w-full mb-8 !py-4 text-lg font-bold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all">
                  Apply for this Job
                </button>

                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <HiCheckCircle className="text-primary-500" /> Perks & Benefits
                </h3>
                <ul className="space-y-4">
                  {job.benefits?.length > 0 ? job.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-3 text-surface-300 bg-surface-950 p-3 rounded-xl border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      {benefit}
                    </li>
                  )) : (
                    <li className="text-surface-400">Standard company benefits apply.</li>
                  )}
                </ul>
              </motion.div>
            </div>

          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowApplyModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-surface-900 border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl"
          >
            <button 
              onClick={() => setShowApplyModal(false)}
              className="absolute top-6 right-6 text-surface-400 hover:text-white transition-colors"
            >
              <HiX className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-display font-bold text-white mb-2">Apply for {job.title}</h2>
            <p className="text-surface-400 mb-6 text-sm">Please provide your details below.</p>

            {applyStatus === 'success' ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-2xl text-center">
                <HiCheckCircle className="w-12 h-12 mx-auto mb-2" />
                <h3 className="text-lg font-bold mb-1">Application Submitted!</h3>
                <p className="text-sm opacity-90">Redirecting to your dashboard...</p>
              </div>
            ) : (
              <form onSubmit={submitApplication} className="space-y-6">
                {applyStatus === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                    {applyMessage}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">Personal & Social Links</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Phone Number *</label>
                    <input type="tel" required value={applyForm.phone} onChange={e => setApplyForm({...applyForm, phone: e.target.value})} className="input-field" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">LinkedIn Profile URL</label>
                    <input type="url" value={applyForm.linkedInUrl} onChange={e => setApplyForm({...applyForm, linkedInUrl: e.target.value})} className="input-field" placeholder="https://linkedin.com/in/username" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">GitHub / Portfolio URL</label>
                    <input type="url" value={applyForm.githubOrPortfolioUrl} onChange={e => setApplyForm({...applyForm, githubOrPortfolioUrl: e.target.value})} className="input-field" placeholder="https://github.com/username or portfolio.com" />
                  </div>

                  <div className="col-span-1 md:col-span-2 mt-4">
                    <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">Professional Experience</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Years of Experience *</label>
                    <select required value={applyForm.experienceYears} onChange={e => setApplyForm({...applyForm, experienceYears: e.target.value})} className="input-field">
                      <option value="">Select Experience</option>
                      <option value="Less than 1 year">Less than 1 year</option>
                      <option value="1-3 years">1-3 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5-8 years">5-8 years</option>
                      <option value="8+ years">8+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Current/Most Recent Company</label>
                    <input type="text" value={applyForm.currentCompany} onChange={e => setApplyForm({...applyForm, currentCompany: e.target.value})} className="input-field" placeholder="Company Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Highest Education Level</label>
                    <select value={applyForm.education} onChange={e => setApplyForm({...applyForm, education: e.target.value})} className="input-field">
                      <option value="">Select Education</option>
                      <option value="High School">High School</option>
                      <option value="Associate Degree">Associate Degree</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 mt-4">
                    <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">Role Logistics</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Expected Salary</label>
                    <input type="text" value={applyForm.expectedSalary} onChange={e => setApplyForm({...applyForm, expectedSalary: e.target.value})} className="input-field" placeholder="e.g. $120,000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Notice Period / Start Date</label>
                    <select value={applyForm.noticePeriod} onChange={e => setApplyForm({...applyForm, noticePeriod: e.target.value})} className="input-field">
                      <option value="">Select Notice Period</option>
                      <option value="Immediately">Immediately</option>
                      <option value="1-2 Weeks">1-2 Weeks</option>
                      <option value="1 Month">1 Month</option>
                      <option value="2+ Months">2+ Months</option>
                    </select>
                  </div>

                  <div className="col-span-1 md:col-span-2 mt-4">
                    <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">Documents</h3>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Resume Link (Google Drive, Dropbox, etc.) *</label>
                    <input 
                      type="url" 
                      required 
                      value={applyForm.resumeUrl} 
                      onChange={e => setApplyForm({...applyForm, resumeUrl: e.target.value})} 
                      className="input-field" 
                      placeholder="https://link-to-your-resume.pdf" 
                    />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Cover Letter / Note</label>
                    <textarea 
                      value={applyForm.coverLetter} 
                      onChange={e => setApplyForm({...applyForm, coverLetter: e.target.value})} 
                      rows="4" 
                      className="input-field resize-none" 
                      placeholder="Tell us why you are a great fit for this role..."
                    ></textarea>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={applyStatus === 'loading'}
                  className="btn-primary w-full !py-4 !rounded-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg shadow-primary-500/25"
                >
                  {applyStatus === 'loading' ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default JobDetail;
