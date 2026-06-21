import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiCheckCircle, HiBriefcase } from 'react-icons/hi';
import { useSelector } from 'react-redux';

const PartnerApply = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    type: 'freelancer',
    skills: '',
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
        <HiCheckCircle className="w-20 h-20 text-emerald-400 mb-6" />
        <h1 className="text-4xl font-display font-bold text-white mb-4">Application Submitted!</h1>
        <p className="text-surface-400 max-w-lg mb-8">
          Thank you for applying to the TechNova Partner Network. Our team will review your portfolio and get back to you within 2-3 business days.
        </p>
        <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Join Partner Network | TechNova</title>
      </Helmet>

      <section className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Join our Partner Network</h1>
          <p className="text-xl text-surface-400 max-w-2xl mx-auto">
            Get access to high-quality projects, earn competitive commissions, and grow your agency or freelance business with TechNova.
          </p>
        </div>

        {!isAuthenticated && (
          <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4 mb-8 text-center text-primary-400">
            You must be logged into a TechNova account to submit an application. <Link to="/login?redirect=/partners/apply" className="underline font-bold">Login or Sign Up here</Link>.
          </div>
        )}

        <div className="glass-card p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">I am applying as a...</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 transition-colors"
                >
                  <option value="freelancer">Solo Freelancer</option>
                  <option value="agency">Agency / Studio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Primary Skills (comma separated)</label>
                <input 
                  type="text" 
                  required
                  placeholder="React, Node.js, UI/UX..."
                  value={formData.skills}
                  onChange={e => setFormData({...formData, skills: e.target.value})}
                  className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Portfolio / Website URL</label>
              <input 
                type="url" 
                required
                placeholder="https://..."
                value={formData.portfolioLink}
                onChange={e => setFormData({...formData, portfolioLink: e.target.value})}
                className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Why do you want to join our network?</label>
              <textarea 
                required
                rows="4"
                value={formData.coverLetter}
                onChange={e => setFormData({...formData, coverLetter: e.target.value})}
                className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 transition-colors resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading || !isAuthenticated} 
              className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
            >
              <HiBriefcase className="w-6 h-6" />
              {loading ? 'Submitting...' : 'Submit Partner Application'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default PartnerApply;
