import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { HiCamera, HiPhone, HiMail, HiUser, HiLockClosed, HiCheck } from 'react-icons/hi';
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
        <title>Profile Settings — TechNova</title>
      </Helmet>
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-white">Profile Settings</h1>
          <p className="text-surface-400 text-sm mt-1">Manage your personal information and account settings</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Profile Photo</h2>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-display font-bold text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <HiCamera className="w-6 h-6 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Upload a new photo</p>
                <p className="text-xs text-surface-400 mt-1">JPG, PNG or WebP. Max 5MB.</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Choose file
                </button>
              </div>
            </div>
          </motion.div>

          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">
                  <HiUser className="inline w-4 h-4 mr-1.5 text-surface-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">
                  <HiMail className="inline w-4 h-4 mr-1.5 text-surface-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input-field opacity-60 cursor-not-allowed"
                />
                <p className="text-xs text-surface-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">
                  <HiPhone className="inline w-4 h-4 mr-1.5 text-surface-400" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field"
                  placeholder="+91 12345 67890"
                />
              </div>
            </div>
          </motion.div>

          {/* Password Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Change Password</h2>
            <p className="text-xs text-surface-400 mb-4">Leave blank to keep your current password</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">
                  <HiLockClosed className="inline w-4 h-4 mr-1.5 text-surface-400" />
                  New Password
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">
                  <HiLockClosed className="inline w-4 h-4 mr-1.5 text-surface-400" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="input-field"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>
          </motion.div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary !px-8"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <HiCheck className="w-4 h-4" />
                  Save Changes
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
