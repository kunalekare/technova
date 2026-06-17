import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { 
  HiKey, HiBell, HiShieldCheck, HiOutlineDesktopComputer, 
  HiOutlineExclamation, HiOutlineCheckCircle, HiOutlineSave, HiOutlineTrash
} from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('security');
  
  // States
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Mock Preferences States
  const [notifications, setNotifications] = useState({
    projectUpdates: true,
    marketingEmails: false,
    securityAlerts: true
  });
  
  const [preferences, setPreferences] = useState({
    theme: localStorage.getItem('technova_theme') || 'purple',
    language: 'English (US)'
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

  const handleSaveNotifications = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 800)),
      {
        loading: 'Saving notification preferences...',
        success: 'Notification preferences updated!',
        error: 'Failed to update preferences.'
      }
    );
  };

  const handleSavePreferences = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 800)),
      {
        loading: 'Applying application preferences...',
        success: 'Preferences saved successfully!',
        error: 'Failed to save preferences.'
      }
    );
  };

  const handleDeleteAccount = () => {
    toast.loading('Initiating account deletion sequence...', { duration: 2000 });
    setTimeout(() => {
      toast.error('Account deletion is restricted for admin accounts in this demo environment.');
      setShowDeleteConfirm(false);
    }, 2000);
  };

  const tabs = [
    { id: 'security', label: 'Security', icon: HiKey, color: 'text-primary-400' },
    { id: 'notifications', label: 'Notifications', icon: HiBell, color: 'text-emerald-400' },
    { id: 'preferences', label: 'Preferences', icon: HiOutlineDesktopComputer, color: 'text-blue-400' },
  ];

  return (
    <>
      <Helmet>
        <title>Settings — Account | TechNova</title>
      </Helmet>

      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Account Settings</h1>
          <p className="text-surface-400 text-sm mt-1">Manage your security credentials, notification rules, and application preferences.</p>
        </div>

        <div className="glass-card rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-white/5 shadow-2xl relative">
          
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Settings Sidebar */}
          <div className="w-full md:w-72 bg-surface-900/80 border-r border-white/5 p-6 flex flex-col gap-2 relative z-10">
            <h3 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-4 ml-2">Configuration</h3>
            
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 group ${
                    isActive ? 'text-white' : 'text-surface-400 hover:text-white hover:bg-surface-800/50'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-primary-500/10 border border-primary-500/20 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 relative z-10 ${isActive ? tab.color : 'group-hover:text-surface-300 transition-colors'}`} />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-8 md:p-10 relative z-10 bg-surface-900/30">
            <AnimatePresence mode="wait">
              
              {/* SECURITY TAB */}
              {activeTab === 'security' && (
                <motion.div 
                  key="security"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-10"
                >
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                        <HiShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-display font-bold text-white">Change Password</h2>
                        <p className="text-xs text-surface-400 mt-0.5">Ensure your account is using a long, random password to stay secure.</p>
                      </div>
                    </div>
                    
                    {!user.password && user.role?.name !== 'admin' ? (
                      <div className="p-5 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-start gap-4">
                        <HiOutlineExclamation className="w-6 h-6 text-primary-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-white font-bold mb-1">Managed by Google</h4>
                          <p className="text-sm text-primary-300/80">You signed in using a Google Account. Password changes are managed externally through your Google profile settings.</p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handlePasswordChange} className="space-y-5 max-w-lg">
                        <div>
                          <label className="text-sm font-medium text-surface-300 mb-2 block">Current Password</label>
                          <input
                            type="password" required value={passwords.currentPassword}
                            onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                            className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors"
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="text-sm font-medium text-surface-300 mb-2 block">New Password</label>
                            <input
                              type="password" required minLength={6} value={passwords.newPassword}
                              onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                              className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors"
                              placeholder="••••••••"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-surface-300 mb-2 block">Confirm New Password</label>
                            <input
                              type="password" required minLength={6} value={passwords.confirmPassword}
                              onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                              className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors"
                              placeholder="••••••••"
                            />
                          </div>
                        </div>
                        <div className="pt-2">
                          <button type="submit" disabled={loading || !passwords.newPassword} className="py-3 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center">
                            {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span> : <HiOutlineSave className="w-5 h-5 mr-2" />}
                            Update Password
                          </button>
                        </div>
                      </form>
                    )}
                  </section>

                  <hr className="border-white/5" />

                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                        <HiOutlineExclamation className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-display font-bold text-white">Danger Zone</h2>
                        <p className="text-xs text-surface-400 mt-0.5">Irreversible actions regarding your account data.</p>
                      </div>
                    </div>

                    <div className="p-6 border border-red-500/20 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center bg-red-500/5 gap-6">
                      <div>
                        <h4 className="text-white font-bold text-lg mb-1">Delete Account</h4>
                        <p className="text-sm text-surface-400 max-w-md">Once you delete your account, there is no going back. Please be certain.</p>
                      </div>
                      
                      {showDeleteConfirm ? (
                        <div className="flex items-center gap-3 shrink-0">
                          <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2.5 bg-surface-800 text-white hover:bg-surface-700 rounded-xl text-sm font-bold transition-colors">
                            Cancel
                          </button>
                          <button onClick={handleDeleteAccount} className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 transition-colors flex items-center">
                            <HiOutlineTrash className="w-4 h-4 mr-2" /> Confirm Delete
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setShowDeleteConfirm(true)} className="px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-sm font-bold transition-colors shrink-0 flex items-center">
                          <HiOutlineTrash className="w-4 h-4 mr-2" /> Delete Account
                        </button>
                      )}
                    </div>
                  </section>
                </motion.div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                <motion.div 
                  key="notifications"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8 max-w-2xl"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <HiBell className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold text-white">Email Notifications</h2>
                      <p className="text-xs text-surface-400 mt-0.5">Control what alerts you receive in your inbox.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 bg-surface-800/50 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                      <div>
                        <h4 className="text-white font-bold">Project Updates</h4>
                        <p className="text-sm text-surface-400 mt-0.5">Get notified when there is activity on your projects.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input type="checkbox" className="sr-only peer" checked={notifications.projectUpdates} onChange={(e) => setNotifications({...notifications, projectUpdates: e.target.checked})} />
                        <div className="w-12 h-6 bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-5 bg-surface-800/50 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                      <div>
                        <h4 className="text-white font-bold">Marketing Emails</h4>
                        <p className="text-sm text-surface-400 mt-0.5">Receive updates about new services and offers.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input type="checkbox" className="sr-only peer" checked={notifications.marketingEmails} onChange={(e) => setNotifications({...notifications, marketingEmails: e.target.checked})} />
                        <div className="w-12 h-6 bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-5 bg-surface-800/50 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                      <div>
                        <h4 className="text-white font-bold">Security Alerts</h4>
                        <p className="text-sm text-surface-400 mt-0.5">Get notified about logins from new devices.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input type="checkbox" className="sr-only peer" checked={notifications.securityAlerts} onChange={(e) => setNotifications({...notifications, securityAlerts: e.target.checked})} />
                        <div className="w-12 h-6 bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button onClick={handleSaveNotifications} className="py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20 flex items-center">
                      <HiOutlineCheckCircle className="w-5 h-5 mr-2" /> Save Notification Rules
                    </button>
                  </div>
                </motion.div>
              )}

              {/* PREFERENCES TAB */}
              {activeTab === 'preferences' && (
                <motion.div 
                  key="preferences"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8 max-w-xl"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <HiOutlineDesktopComputer className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold text-white">Application Preferences</h2>
                      <p className="text-xs text-surface-400 mt-0.5">Customize your TechNova viewing experience.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-white mb-3 block">Primary Color Theme</label>
                      <div className="flex flex-wrap items-center gap-4">
                        {[
                          { id: 'purple', color: 'bg-[#6c5ce7]', name: 'TechNova Purple' },
                          { id: 'blue', color: 'bg-blue-500', name: 'Ocean Blue' },
                          { id: 'emerald', color: 'bg-emerald-500', name: 'Emerald Green' },
                          { id: 'rose', color: 'bg-rose-500', name: 'Rose Red' },
                          { id: 'amber', color: 'bg-amber-500', name: 'Amber Gold' }
                        ].map(theme => (
                          <button
                            key={theme.id}
                            onClick={() => {
                              setPreferences({...preferences, theme: theme.id});
                              document.documentElement.setAttribute('data-theme', theme.id);
                              localStorage.setItem('technova_theme', theme.id);
                            }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${theme.color} ${
                              preferences.theme === theme.id ? 'ring-4 ring-offset-4 ring-offset-surface-900 ring-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'hover:scale-110 border-2 border-white/20 opacity-60 hover:opacity-100'
                            }`}
                            title={theme.name}
                          >
                            {preferences.theme === theme.id && <HiOutlineCheckCircle className="w-6 h-6 text-white drop-shadow-md" />}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-surface-500 mt-4">Select a primary accent color for the entire application interface. The change is applied instantly across all pages.</p>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-white mb-2 block">Display Language</label>
                      <select 
                        value={preferences.language} onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                        className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3.5 text-surface-300 focus:border-blue-500 focus:text-white outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option>English (US)</option>
                        <option>Spanish (ES)</option>
                        <option>French (FR)</option>
                        <option>German (DE)</option>
                      </select>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                      <button onClick={handleSavePreferences} className="py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/20 flex items-center">
                        <HiOutlineSave className="w-5 h-5 mr-2" /> Save Display Preferences
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
