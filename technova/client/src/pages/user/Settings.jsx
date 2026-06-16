import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { HiKey, HiBell, HiShieldCheck, HiOutlineDesktopComputer } from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('security');
  const [loading, setLoading] = useState(false);
  
  // Password State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    
    setLoading(true);
    try {
      await api.put('/auth/update-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings — TechNova</title>
      </Helmet>

      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Account Settings</h1>
          <p className="text-surface-400 text-sm mt-1">Manage your security preferences and account configuration.</p>
        </div>

        <div className="bg-surface-900 border border-white/5 rounded-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          {/* Settings Sidebar */}
          <div className="w-full md:w-64 bg-surface-950/50 border-r border-white/5 p-4 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'security' ? 'bg-primary-500/10 text-primary-400' : 'text-surface-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <HiKey className="w-5 h-5" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'notifications' ? 'bg-primary-500/10 text-primary-400' : 'text-surface-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <HiBell className="w-5 h-5" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'preferences' ? 'bg-primary-500/10 text-primary-400' : 'text-surface-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <HiOutlineDesktopComputer className="w-5 h-5" />
              Preferences
            </button>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-6 md:p-8">
            {activeTab === 'security' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <HiShieldCheck className="w-5 h-5 text-primary-400" />
                    Change Password
                  </h2>
                  
                  {!user.password && user.role?.name !== 'admin' ? (
                    <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                      <p className="text-sm text-primary-400">You signed in using Google. Password changes are disabled for your account.</p>
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                      <div>
                        <label className="text-sm text-surface-300 mb-1.5 block">Current Password</label>
                        <input
                          type="password"
                          required
                          value={passwords.currentPassword}
                          onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                          className="input-field"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-surface-300 mb-1.5 block">New Password</label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={passwords.newPassword}
                          onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                          className="input-field"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-surface-300 mb-1.5 block">Confirm New Password</label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={passwords.confirmPassword}
                          onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                          className="input-field"
                          placeholder="••••••••"
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary w-full disabled:opacity-50"
                      >
                        {loading ? 'Updating...' : 'Update Password'}
                      </button>
                    </form>
                  )}
                </div>

                <hr className="border-white/5" />

                <div>
                  <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
                  <div className="p-4 border border-red-500/20 rounded-lg flex justify-between items-center bg-red-500/5">
                    <div>
                      <h4 className="text-white font-medium">Delete Account</h4>
                      <p className="text-xs text-surface-400 mt-1">Permanently delete your account and all data.</p>
                    </div>
                    <button className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm font-medium transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-white mb-4">Email Notifications</h2>
                
                <div className="space-y-4">
                  {[
                    { title: 'Project Updates', desc: 'Get notified when there is activity on your projects.' },
                    { title: 'Marketing Emails', desc: 'Receive updates about new services and offers.' },
                    { title: 'Security Alerts', desc: 'Get notified about logins from new devices.' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-surface-800 rounded-lg border border-white/5">
                      <div>
                        <h4 className="text-white text-sm font-medium">{item.title}</h4>
                        <p className="text-xs text-surface-400">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={i !== 1} />
                        <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-white mb-4">Application Preferences</h2>
                
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-sm text-surface-300 mb-1.5 block">Theme</label>
                    <select className="input-field bg-surface-800">
                      <option>Dark Mode (Default)</option>
                      <option>Light Mode</option>
                      <option>System Default</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-surface-300 mb-1.5 block">Language</label>
                    <select className="input-field bg-surface-800">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <button className="btn-primary mt-4">Save Preferences</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
