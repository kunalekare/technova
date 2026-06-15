import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiMail, HiPhone, HiLocationMarker, HiCheck } from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', requirement: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error('Name and email are required');
      return;
    }
    setLoading(true);
    try {
      await api.post('/leads', { ...form, source: 'contact_form' });
      setSubmitted(true);
      toast.success('Message sent successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us — TechNova Solutions</title>
        <meta name="description" content="Get in touch with TechNova Solutions. Contact us for project inquiries, free quotes, or any questions about our 16+ technology services." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14 pt-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Let's <span className="gradient-text">Connect</span>
            </h1>
            <p className="text-surface-400 max-w-xl mx-auto">
              Have a project in mind? Need a free consultation? Drop us a message and we'll get back to you within 24 hours.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="glass-card p-6">
                <h3 className="text-lg font-display font-semibold text-white mb-6">Contact Information</h3>
                <div className="space-y-5">
                  <a href="mailto:hello@technova.com" className="flex items-center gap-4 text-surface-300 hover:text-primary-400 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                      <HiMail className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <div className="text-xs text-surface-500">Email</div>
                      <div className="text-sm">hello@technova.com</div>
                    </div>
                  </a>
                  <a href="tel:+919876543210" className="flex items-center gap-4 text-surface-300 hover:text-primary-400 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                      <HiPhone className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <div className="text-xs text-surface-500">Phone</div>
                      <div className="text-sm">+91 98765 43210</div>
                    </div>
                  </a>
                  <div className="flex items-center gap-4 text-surface-300">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                      <HiLocationMarker className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <div className="text-xs text-surface-500">Office</div>
                      <div className="text-sm">Bangalore, India</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-3">Office Hours</h3>
                <div className="text-sm text-surface-400 space-y-1">
                  <p>Mon – Fri: 9:00 AM – 7:00 PM IST</p>
                  <p>Sat: 10:00 AM – 4:00 PM IST</p>
                  <p>Sun: Closed</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="glass-card p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto rounded-full bg-accent-500/20 flex items-center justify-center mb-4">
                      <HiCheck className="w-8 h-8 text-accent-400" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-surface-400">We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm text-surface-300 mb-1.5 block">Name *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="input-field"
                          placeholder="Your name"
                          id="contact-name"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-surface-300 mb-1.5 block">Email *</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="input-field"
                          placeholder="your@email.com"
                          id="contact-email"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm text-surface-300 mb-1.5 block">Phone</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="input-field"
                          placeholder="+91 ..."
                          id="contact-phone"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-surface-300 mb-1.5 block">Company</label>
                        <input
                          type="text"
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          className="input-field"
                          placeholder="Company name"
                          id="contact-company"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-surface-300 mb-1.5 block">Your Requirement</label>
                      <textarea
                        rows={5}
                        value={form.requirement}
                        onChange={(e) => setForm({ ...form, requirement: e.target.value })}
                        className="input-field resize-none"
                        placeholder="Describe your project or ask us anything..."
                        id="contact-message"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full disabled:opacity-50"
                      id="contact-submit-btn"
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
