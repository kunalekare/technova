import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HiBriefcase, HiCurrencyRupee, HiClock, HiLocationMarker, HiCheckCircle, HiArrowLeft, HiX } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import api from '../../services/api';

const InternshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({ 
    phone: '', linkedInUrl: '', githubOrPortfolioUrl: '',
    universityName: '', majorOrDegree: '', expectedGraduation: '',
    availability: '', resumeUrl: '', coverLetter: '' 
  });
  const [applyStatus, setApplyStatus] = useState('idle'); // idle, loading, success, error
  const [applyMessage, setApplyMessage] = useState('');

  useEffect(() => {
    fetchInternship();
  }, [id]);

  const fetchInternship = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/internships/${id}`);
      setInternship(res.data.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load internship details. It may no longer exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    if (!user) {
      navigate('/login', { state: { from: `/internships/${id}` } });
      return;
    }
    setShowApplyModal(true);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    setApplyStatus('loading');
    try {
      const res = await api.post(`/internships/${id}/apply`, applyForm);
      if (res.data.success) {
        setApplyStatus('success');
        setApplyMessage('Application submitted successfully!');
        setTimeout(() => {
          setShowApplyModal(false);
          setApplyStatus('idle');
          navigate('/dashboard/internships');
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

  if (error || !internship) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-white mb-4">Oops!</h2>
        <p className="text-surface-400 mb-6 text-center">{error}</p>
        <Link to="/internships" className="btn-secondary flex items-center gap-2">
          <HiArrowLeft /> Back to Internships
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{internship.title} | Internships at TechNova</title>
      </Helmet>

      <div className="min-h-screen pt-24 pb-16 relative">
        {/* Background blobs */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-primary-500/10 blur-3xl rounded-full" />
        <div className="absolute top-60 right-10 w-96 h-96 bg-accent-500/10 blur-3xl rounded-full" />

        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <Link to="/internships" className="inline-flex items-center gap-2 text-surface-400 hover:text-white transition-colors mb-8 font-medium">
            <HiArrowLeft className="w-4 h-4" /> Back to open internships
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Main Content */}
            <div className="w-full lg:w-2/3 space-y-6">
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-900 border border-white/5 rounded-3xl p-8 md:p-10 shadow-xl">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex flex-shrink-0 items-center justify-center border border-primary-500/30">
                    <HiBriefcase className="w-10 h-10 text-primary-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">{internship.title}</h1>
                    <p className="text-lg text-primary-400 font-medium">{internship.company}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-surface-800 rounded-md text-xs font-medium text-surface-300">
                      {internship.department}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-white/5 mb-6 bg-surface-950/50 rounded-2xl p-6">
                  <div>
                    <p className="text-xs text-surface-500 mb-1 font-medium uppercase tracking-wider">Stipend</p>
                    <p className="text-white font-bold flex items-center gap-1"><HiCurrencyRupee className="text-emerald-400 w-5 h-5"/> {internship.stipend || 'Competitive'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 mb-1 font-medium uppercase tracking-wider">Duration</p>
                    <p className="text-white font-bold flex items-center gap-1"><HiClock className="text-blue-400 w-5 h-5"/> {internship.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 mb-1 font-medium uppercase tracking-wider">Work Mode</p>
                    <p className="text-white font-bold flex items-center gap-1"><HiLocationMarker className="text-purple-400 w-5 h-5"/> {internship.mode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500 mb-1 font-medium uppercase tracking-wider">Apply By</p>
                    <p className="text-white font-bold">{internship.deadline ? new Date(internship.deadline).toLocaleDateString() : 'Ongoing'}</p>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <h2 className="text-xl font-bold text-white mb-4">About the Internship</h2>
                  <p className="text-surface-300 leading-relaxed mb-8 text-lg">{internship.description}</p>

                  <h2 className="text-xl font-bold text-white mb-4">Responsibilities</h2>
                  <ul className="space-y-4 mb-8">
                    {internship.responsibilities?.map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-surface-300 text-lg">
                        <div className="w-2 h-2 rounded-full bg-primary-400 mt-2.5 flex-shrink-0 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <h2 className="text-xl font-bold text-white mb-4">Who can apply?</h2>
                  <ul className="space-y-4 mb-8">
                    {internship.requirements?.map((item, i) => (
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
                  Apply Now
                </button>
                <p className="text-center text-xs text-surface-500 mb-8">Typically replies within 3 days.</p>

                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <HiCheckCircle className="text-primary-500" /> Perks & Benefits
                </h3>
                <ul className="space-y-4">
                  {internship.perks?.map((perk, i) => (
                    <li key={i} className="flex items-center gap-3 text-surface-300 bg-surface-950 p-3 rounded-xl border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

          </div>
        </div>
      </div>

      {/* Detailed Application Modal */}
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
            <h2 className="text-2xl font-display font-bold text-white mb-2">Apply for {internship.title}</h2>
            <p className="text-surface-400 mb-6 text-sm">Please provide your details below to submit your application.</p>

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
                    <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">Academic Details</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">College / University Name *</label>
                    <input type="text" required value={applyForm.universityName} onChange={e => setApplyForm({...applyForm, universityName: e.target.value})} className="input-field" placeholder="University Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Major / Degree *</label>
                    <input type="text" required value={applyForm.majorOrDegree} onChange={e => setApplyForm({...applyForm, majorOrDegree: e.target.value})} className="input-field" placeholder="e.g. B.Tech Computer Science" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Expected Graduation Year *</label>
                    <select required value={applyForm.expectedGraduation} onChange={e => setApplyForm({...applyForm, expectedGraduation: e.target.value})} className="input-field">
                      <option value="">Select Year</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028+">2028 or later</option>
                      <option value="Already Graduated">Already Graduated</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Availability *</label>
                    <select required value={applyForm.availability} onChange={e => setApplyForm({...applyForm, availability: e.target.value})} className="input-field">
                      <option value="">Select Availability</option>
                      <option value="Full-time (Available Immediately)">Full-time (Available Immediately)</option>
                      <option value="Part-time (Available Immediately)">Part-time (Available Immediately)</option>
                      <option value="Only during summer">Only during summer</option>
                      <option value="Other">Other</option>
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
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Cover Letter / Why should we hire you?</label>
                    <textarea 
                      value={applyForm.coverLetter} 
                      onChange={e => setApplyForm({...applyForm, coverLetter: e.target.value})} 
                      rows="4" 
                      className="input-field resize-none" 
                      placeholder="Tell us about your passion for this role..."
                    ></textarea>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={applyStatus === 'loading'}
                  className="btn-primary w-full !py-4 !rounded-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
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

export default InternshipDetail;
