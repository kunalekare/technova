import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBranding, updateBranding, resetBrandingState } from '../../redux/slices/brandingSlice';
import { HiColorSwatch, HiPhotograph, HiOfficeBuilding } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Branding = () => {
  const dispatch = useDispatch();
  const { branding, loading, updateSuccess, error } = useSelector((state) => state.branding);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    companyName: '',
    logoUrl: '',
    primaryColor: '#6366f1',
    secondaryColor: '#a855f7',
  });

  useEffect(() => {
    dispatch(fetchBranding());
  }, [dispatch]);

  useEffect(() => {
    if (branding) {
      setFormData({
        companyName: branding.companyName || '',
        logoUrl: branding.logoUrl || '',
        primaryColor: branding.primaryColor || '#6366f1',
        secondaryColor: branding.secondaryColor || '#a855f7',
      });
    }
  }, [branding]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success('Branding updated successfully! Changes applied immediately.');
      dispatch(resetBrandingState());
    }
    if (error) {
      toast.error(error);
      dispatch(resetBrandingState());
    }
  }, [updateSuccess, error, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateBranding(formData));
  };

  if (user?.parentAccount) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl text-white mb-2">Access Denied</h2>
        <p className="text-surface-400">Only the primary account holder can update organization branding.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="glass-card p-6 border-l-4 border-primary-500">
        <h2 className="text-2xl font-bold text-white mb-2">White-Label Branding</h2>
        <p className="text-surface-300">
          Customize your client portal. The colors and logo you choose here will be applied across the entire dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1">Company Name</label>
            <div className="relative">
              <HiOfficeBuilding className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Acme Corp"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1">Logo URL</label>
            <div className="relative">
              <HiPhotograph className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1">Primary Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  className="w-10 h-10 rounded cursor-pointer bg-surface-900 border border-white/10"
                />
                <input
                  type="text"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  className="input-field flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1">Secondary Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={handleChange}
                  className="w-10 h-10 rounded cursor-pointer bg-surface-900 border border-white/10"
                />
                <input
                  type="text"
                  name="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={handleChange}
                  className="input-field flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-white/10 pt-6">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Save Branding'}
          </button>
        </div>
      </form>
      
      {/* Live Preview Area */}
      <div className="glass-card p-6">
         <h3 className="text-lg font-bold text-white mb-4">Live Preview</h3>
         <div className="p-6 rounded-lg border border-white/10" style={{ backgroundColor: 'var(--color-surface-950)' }}>
            <div className="flex items-center gap-4 mb-6">
               {formData.logoUrl ? (
                 <img src={formData.logoUrl} alt="Logo" className="w-10 h-10 rounded" />
               ) : (
                 <div className="w-10 h-10 rounded flex items-center justify-center text-white font-bold" style={{ background: formData.primaryColor }}>
                   Logo
                 </div>
               )}
               <span className="text-xl font-bold text-white">{formData.companyName || 'Your Company'}</span>
            </div>
            
            <button className="px-4 py-2 rounded-lg text-white font-medium" style={{ background: `linear-gradient(to right, ${formData.primaryColor}, ${formData.secondaryColor})` }}>
              Example Button
            </button>
         </div>
      </div>
    </div>
  );
};

export default Branding;
