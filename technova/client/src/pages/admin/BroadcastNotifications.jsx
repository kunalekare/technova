import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  HiOutlineBell, HiPaperAirplane, HiOutlineStatusOnline, 
  HiOutlineGlobeAlt, HiOutlineLightningBolt, HiOutlineInformationCircle
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { addNotification } from '../../redux/slices/notificationSlice';

const BroadcastNotifications = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ title: '', message: '', target: 'all', type: 'info' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      toast.success(`Broadcast successfully pushed to ${formData.target === 'all' ? 'everyone' : formData.target}!`);
      
      // Dispatch locally to instantly show up in the Bell icon
      dispatch(addNotification({
        _id: 'brd_' + Date.now(),
        type: formData.type,
        title: formData.title,
        message: formData.message,
        isRead: false,
        createdAt: new Date().toISOString()
      }));

      setFormData({ title: '', message: '', target: 'all', type: 'info' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Broadcast Center — Admin | TechNova</title>
      </Helmet>

      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Broadcast Center</h1>
            <p className="text-surface-400 text-sm mt-1">Push real-time alerts and announcements to connected users via WebSocket.</p>
          </div>
          <div className="glass-card px-4 py-2.5 rounded-xl border border-white/10 text-sm text-white flex items-center shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mr-3"></span>
            <span className="font-bold text-emerald-400 text-lg mr-2">1,248</span> 
            <span className="text-surface-400 font-medium">Active Connections</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <HiOutlineStatusOnline className="w-24 h-24 text-emerald-500 -mt-6 -mr-6" />
            </div>
            <div className="relative z-10">
              <p className="text-xs text-surface-400 font-bold uppercase tracking-wider mb-1">System Health</p>
              <p className="text-3xl font-display font-bold text-emerald-400">Optimal</p>
              <p className="text-xs text-surface-500 mt-2 font-mono">WS_LATENCY: 12ms</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <HiOutlineGlobeAlt className="w-24 h-24 text-primary-500 -mt-6 -mr-6" />
            </div>
            <div className="relative z-10">
              <p className="text-xs text-surface-400 font-bold uppercase tracking-wider mb-1">Daily Broadcasts</p>
              <p className="text-3xl font-display font-bold text-white">4</p>
              <p className="text-xs text-primary-400 mt-2 font-medium">Below daily limit (20)</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <HiOutlineLightningBolt className="w-24 h-24 text-amber-500 -mt-6 -mr-6" />
            </div>
            <div className="relative z-10">
              <p className="text-xs text-surface-400 font-bold uppercase tracking-wider mb-1">Delivery Success</p>
              <p className="text-3xl font-display font-bold text-white">99.9%</p>
              <p className="text-xs text-amber-400 mt-2 font-medium">Last 30 days</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form */}
          <div className="lg:col-span-2 glass-card rounded-3xl overflow-hidden border border-white/5 relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-emerald-500 opacity-50" />
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-500/20 text-primary-400 rounded-2xl flex items-center justify-center">
                    <HiOutlineBell className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white">Compose Alert</h2>
                    <p className="text-surface-400 text-sm mt-0.5">Configure your broadcast payload.</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSend} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-2">Target Audience</label>
                    <select 
                      value={formData.target}
                      onChange={e => setFormData({...formData, target: e.target.value})}
                      className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="all">Global (All Connected Users)</option>
                      <option value="clients">Clients & Customers Only</option>
                      <option value="team">Team Members Only</option>
                      <option value="admins">Administrators Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-2">Notification Type</label>
                    <select 
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="info">Info (Blue)</option>
                      <option value="success">Success (Green)</option>
                      <option value="warning">Warning (Amber)</option>
                      <option value="danger">Critical (Red)</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-surface-300 mb-2">Broadcast Title</label>
                    <input 
                      type="text" required 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors text-lg" 
                      placeholder="e.g. Scheduled Platform Maintenance"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-surface-300 mb-2">Message Body</label>
                    <textarea 
                      required rows="4" 
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-surface-800 border border-white/10 rounded-xl p-4 text-surface-300 focus:border-primary-500 outline-none transition-colors resize-none leading-relaxed" 
                      placeholder="Enter the details of the announcement here..."
                    />
                  </div>
                </div>
                
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <p className="text-xs text-surface-500 flex items-center gap-1.5"><HiOutlineInformationCircle className="w-4 h-4" /> This action cannot be undone.</p>
                  <button type="submit" disabled={isSubmitting || !formData.title || !formData.message} className="py-3 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center">
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <HiPaperAirplane className="w-5 h-5 mr-2 -rotate-45" /> Fire Broadcast
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-bold text-surface-400 uppercase tracking-wider mb-4">Live Preview</h3>
            
            <div className="relative p-6 rounded-3xl bg-surface-900 border border-white/5 shadow-2xl flex flex-col items-center min-h-[400px] overflow-hidden">
              {/* Fake phone/browser UI glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary-500/20 rounded-full blur-[80px] pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {(formData.title || formData.message) ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="w-full max-w-[320px] bg-surface-800/80 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-2xl relative z-10 mt-10"
                  >
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                        formData.type === 'info' ? 'bg-blue-500/20 text-blue-400' :
                        formData.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                        formData.type === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        <HiOutlineBell className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm leading-snug">{formData.title || 'Notification Title'}</h4>
                        <p className="text-surface-300 text-xs mt-1 leading-relaxed line-clamp-3">{formData.message || 'Notification description will appear here...'}</p>
                        <p className="text-surface-500 text-[10px] mt-2 font-medium">Just now • TechNova System</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full opacity-50 relative z-10 mt-20"
                  >
                    <HiOutlineBell className="w-12 h-12 text-surface-600 mb-3" />
                    <p className="text-sm text-surface-400 text-center max-w-[200px]">Start typing to see how the notification will look for your users.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default BroadcastNotifications;
