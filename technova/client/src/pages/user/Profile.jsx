import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { HiCamera, HiPhone, HiMail, HiUser, HiLockClosed, HiCheck, HiOutlineUserCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { updateProfile, resetUpdateSuccess } from '../../redux/slices/userSlice';
import { getMe } from '../../redux/slices/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, updateSuccess, error } = useSelector((state) => state.user);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        password: '',
        confirmPassword: '',
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success('Profile updated successfully!');
      dispatch(resetUpdateSuccess());
      dispatch(getMe());
      setForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
    }
    if (error) {
      toast.error(error);
    }
  }, [updateSuccess, error, dispatch]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (form.password && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (form.password && form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('phone', form.phone);
    if (form.password) {
      formData.append('password', form.password);
    }
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    dispatch(updateProfile(formData));
  };

  return (
    <>
      <Helmet>
        <title>Profile Settings | TechNova</title>
      </Helmet>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header section with glow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-surface-900/50 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-inner">
              <HiOutlineUserCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">Profile Settings</h1>
              <p className="text-surface-400 mt-1">Manage your personal identity, security, and account preferences.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Avatar & Basic Info */}
            <div className="md:col-span-1 space-y-8">
              {/* Avatar Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-8 rounded-3xl border border-white/5 text-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h2 className="text-lg font-bold text-white mb-6 relative z-10">Profile Photo</h2>
                
                <div className="flex flex-col items-center gap-4 relative z-10">
                  <div className="relative group/avatar cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-xl shadow-primary-500/20 border-2 border-white/10 group-hover/avatar:border-primary-500 transition-all duration-300">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500" />
                      ) : (
                        <span className="text-5xl font-display font-bold text-white shadow-sm">
                          {user?.name?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 backdrop-blur-sm">
                      <HiCamera className="w-8 h-8 text-white scale-75 group-hover/avatar:scale-100 transition-transform duration-300" />
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-surface-400">Allowed: JPG, PNG, WebP.</p>
                    <p className="text-sm text-surface-400">Max size: 5MB.</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl transition-colors border border-white/5"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Forms */}
            <div className="md:col-span-2 space-y-8">
              {/* Personal Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card p-8 rounded-3xl border border-white/5 relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[60px]" />
                <h2 className="text-xl font-display font-bold text-white mb-6 relative z-10">Personal Information</h2>
                
                <div className="space-y-5 relative z-10">
                  <div>
                    <label className="block text-xs font-bold text-surface-500 mb-2 uppercase tracking-wider">
                      <HiUser className="inline w-4 h-4 mr-1.5 text-surface-400" /> Full Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-surface-500 mb-2 uppercase tracking-wider">
                        <HiMail className="inline w-4 h-4 mr-1.5 text-surface-400" /> Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full bg-surface-900/80 border border-white/5 rounded-xl px-4 py-3.5 text-surface-400 cursor-not-allowed select-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-surface-500 mb-2 uppercase tracking-wider">
                        <HiPhone className="inline w-4 h-4 mr-1.5 text-surface-400" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                        placeholder="+91 12345 67890"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Password Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-8 rounded-3xl border border-white/5 relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-[60px]" />
                <div className="mb-6 relative z-10">
                  <h2 className="text-xl font-display font-bold text-white">Security Settings</h2>
                  <p className="text-sm text-surface-400 mt-1">Leave password fields blank if you do not wish to change it.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
                  <div>
                    <label className="block text-xs font-bold text-surface-500 mb-2 uppercase tracking-wider">
                      <HiLockClosed className="inline w-4 h-4 mr-1.5 text-surface-400" /> New Password
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-surface-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-surface-500 mb-2 uppercase tracking-wider">
                      <HiLockClosed className="inline w-4 h-4 mr-1.5 text-surface-400" /> Confirm Password
                    </label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-surface-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Submit */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-end pt-4"
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary relative overflow-hidden group shadow-lg shadow-primary-500/20 !px-10 !py-4 text-lg w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  {loading ? (
                    <span className="flex items-center gap-3 relative z-10">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving Changes...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 relative z-10">
                      <HiCheck className="w-6 h-6" />
                      Save All Changes
                    </span>
                  )}
                </button>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
