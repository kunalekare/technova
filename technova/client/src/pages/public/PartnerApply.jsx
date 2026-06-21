import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiCheckCircle, HiBriefcase, HiOutlineUserGroup, HiOutlineCurrencyDollar, HiOutlineLightningBolt } from 'react-icons/hi';
import { useSelector } from 'react-redux';

const PartnerApply = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    type: 'freelancer',
    skills: '',
    experienceYears: '',
    expectedHourlyRate: '',
    availability: 'full-time',
    linkedinUrl: '',
    portfolioLink: '',
    coverLetter: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login or create an account first to apply as a partner');
      navigate('/login?redirect=/partners/apply');
      return;
    }

    setLoading(true);
    try {
      await api.post('/partners/apply', {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()),
      });
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <HiCheckCircle className="w-24 h-24 text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
        <h1 className="text-5xl font-display font-bold text-white mb-6">Application Submitted!</h1>
        <p className="text-surface-400 max-w-xl mx-auto text-lg mb-10 leading-relaxed">
          Thank you for applying to the TechNova Partner Network. Our talent acquisition team will review your credentials and get back to you within 2-3 business days.
        </p>
        <Link to="/dashboard" className="btn-primary px-8 py-4 text-lg">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Join Partner Network | TechNova</title>
      </Helmet>

      <section className="pt-32 pb-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Benefits & Selling Points */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            <div>
              <span className="text-primary-400 font-bold tracking-wider uppercase text-sm mb-2 block">TechNova Talent</span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                Join our elite Partner Network
              </h1>
              <p className="text-lg text-surface-400 mb-8 leading-relaxed">
                Get exclusive access to high-quality enterprise projects, earn competitive commissions, and grow your agency or freelance business with TechNova.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <HiOutlineCurrencyDollar className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Premium Rates & Payouts</h3>
                  <p className="text-surface-400 text-sm">We charge premium enterprise rates, ensuring our partners are paid top-tier market value for their expertise.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
                  <HiOutlineUserGroup className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Pre-vetted Enterprise Clients</h3>
                  <p className="text-surface-400 text-sm">Skip the sales hustle. We bring fully scoped, funded projects directly to you from global brands.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <HiOutlineLightningBolt className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Focus on Execution</h3>
                  <p className="text-surface-400 text-sm">We handle project management, scoping, client communication, and billing. You just build.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:col-span-7 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-purple-600 rounded-[2rem] blur opacity-20"></div>
            <div className="glass-card p-8 md:p-12 relative rounded-[2rem] border border-white/10 bg-surface-900/80 backdrop-blur-xl">
              
              {!isAuthenticated && (
                <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-6 mb-8 text-center">
                  <p className="text-primary-400 text-lg mb-2">Authentication Required</p>
                  <p className="text-surface-300 text-sm mb-4">You must be logged into a TechNova account to submit a partner application.</p>
                  <Link to="/login?redirect=/partners/apply" className="btn-primary inline-block">Login or Sign Up</Link>
                </div>
              )}

              <form onSubmit={handleSubmit} className={`space-y-6 ${!isAuthenticated ? 'opacity-50 pointer-events-none filter blur-[2px]' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-surface-200 mb-2">Application Type</label>
                    <select 
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-surface-950 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
                    >
                      <option value="freelancer">Solo Freelancer</option>
                      <option value="agency">Agency / Studio</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-200 mb-2">Availability</label>
                    <select 
                      value={formData.availability}
                      onChange={e => setFormData({...formData, availability: e.target.value})}
                      className="w-full bg-surface-950 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
                    >
                      <option value="full-time">Full-time (40h/week)</option>
                      <option value="part-time">Part-time (20h/week)</option>
                      <option value="contract">Project-based Contract</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-surface-200 mb-2">Primary Skills (comma separated)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. React, Node.js, UI/UX Design, AWS..."
                    value={formData.skills}
                    onChange={e => setFormData({...formData, skills: e.target.value})}
                    className="w-full bg-surface-950 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none placeholder-surface-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-surface-200 mb-2">Years of Experience</label>
                    <input 
                      type="number" 
                      min="0"
                      step="0.5"
                      required
                      placeholder="e.g. 5"
                      value={formData.experienceYears}
                      onChange={e => setFormData({...formData, experienceYears: e.target.value})}
                      className="w-full bg-surface-950 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none placeholder-surface-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-200 mb-2">Expected Hourly Rate (USD)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-surface-400">$</span>
                      </div>
                      <input 
                        type="number" 
                        min="1"
                        required
                        placeholder="e.g. 50"
                        value={formData.expectedHourlyRate}
                        onChange={e => setFormData({...formData, expectedHourlyRate: e.target.value})}
                        className="w-full bg-surface-950 border border-white/10 rounded-xl pl-8 pr-4 py-3.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none placeholder-surface-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-surface-200 mb-2">Portfolio / Website URL</label>
                    <input 
                      type="url" 
                      required
                      placeholder="https://..."
                      value={formData.portfolioLink}
                      onChange={e => setFormData({...formData, portfolioLink: e.target.value})}
                      className="w-full bg-surface-950 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none placeholder-surface-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-200 mb-2">LinkedIn URL</label>
                    <input 
                      type="url" 
                      required
                      placeholder="https://linkedin.com/in/..."
                      value={formData.linkedinUrl}
                      onChange={e => setFormData({...formData, linkedinUrl: e.target.value})}
                      className="w-full bg-surface-950 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none placeholder-surface-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-surface-200 mb-2">Why TechNova? (Cover Letter)</label>
                  <textarea 
                    required
                    rows="4"
                    placeholder="Tell us about your background and why you'd be a great fit for our network..."
                    value={formData.coverLetter}
                    onChange={e => setFormData({...formData, coverLetter: e.target.value})}
                    className="w-full bg-surface-950 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none resize-none placeholder-surface-500"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !isAuthenticated} 
                  className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 mt-4 shadow-lg shadow-primary-500/25"
                >
                  <HiBriefcase className="w-6 h-6" />
                  {loading ? 'Submitting Application...' : 'Submit Partner Application'}
                </button>
                <p className="text-center text-surface-500 text-xs mt-4">
                  By submitting this application, you agree to TechNova's Partner Terms of Service and Privacy Policy.
                </p>
              </form>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default PartnerApply;
