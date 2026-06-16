import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { HiOutlineBell, HiPaperAirplane } from 'react-icons/hi';
import toast from 'react-hot-toast';

const BroadcastNotifications = () => {
  const [formData, setFormData] = useState({ title: '', message: '', target: 'all' });

  const handleSend = (e) => {
    e.preventDefault();
    toast.success('Broadcast sent! Socket.io will emit this to ' + formData.target);
    setFormData({ title: '', message: '', target: 'all' });
  };

  return (
    <>
      <Helmet>
        <title>Broadcasts — TechNova Admin</title>
      </Helmet>

      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Broadcast Notifications</h1>
          <p className="text-surface-400 text-sm mt-1">Send real-time alerts to users across the platform.</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
              <HiOutlineBell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">New Broadcast Message</h2>
              <p className="text-surface-400 text-xs">Pushed via Socket.io instantly</p>
            </div>
          </div>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1">Target Audience</label>
              <select 
                value={formData.target}
                onChange={e => setFormData({...formData, target: e.target.value})}
                className="input-field"
              >
                <option value="all">All Users</option>
                <option value="clients">Clients Only</option>
                <option value="team">Team Only</option>
                <option value="admins">Admins Only</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1">Title</label>
              <input 
                type="text" 
                required 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="input-field" 
                placeholder="e.g. Scheduled Maintenance"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1">Message</label>
              <textarea 
                required 
                rows="4" 
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="input-field" 
                placeholder="Message body..."
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <button type="submit" className="btn-primary flex items-center">
                <HiPaperAirplane className="w-4 h-4 mr-2 -rotate-45" /> Send Broadcast
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BroadcastNotifications;
