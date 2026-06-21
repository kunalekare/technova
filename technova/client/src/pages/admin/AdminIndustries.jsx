import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiPlus, HiPencilAlt, HiTrash } from 'react-icons/hi';

const AdminIndustries = () => {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ slug: '', industryName: '', heroText: '', seoMeta: { title: '', description: '', keywords: '' } });

  const fetchIndustries = async () => {
    try {
      const res = await api.get('/industries');
      setIndustries(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch industries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await api.put(`/industries/${formData._id}`, formData);
        toast.success('Industry updated');
      } else {
        await api.post('/industries', formData);
        toast.success('Industry created');
      }
      setShowModal(false);
      setFormData({ slug: '', industryName: '', heroText: '', seoMeta: { title: '', description: '', keywords: '' } });
      fetchIndustries();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving industry');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this industry page?')) return;
    try {
      await api.delete(`/industries/${id}`);
      toast.success('Deleted');
      fetchIndustries();
    } catch (err) {
      toast.error('Error deleting industry');
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Industries | TechNova Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Industry Landing Pages</h1>
            <p className="text-surface-400">Manage SEO-optimized industry pages.</p>
          </div>
          <button onClick={() => { setFormData({ slug: '', industryName: '', heroText: '', seoMeta: { title: '', description: '', keywords: '' } }); setShowModal(true); }} className="btn-primary">
            <HiPlus className="w-5 h-5 mr-1 inline" /> Add Industry
          </button>
        </div>

        {loading ? (
          <div className="text-surface-400 text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map(ind => (
              <div key={ind._id} className="glass-card p-6 flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{ind.industryName}</h3>
                  <p className="text-xs font-mono text-primary-400 mb-4 bg-primary-500/10 inline-block px-2 py-1 rounded">/{ind.slug}</p>
                  <p className="text-sm text-surface-400 line-clamp-3">{ind.heroText}</p>
                </div>
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-white/10">
                  <button onClick={() => { setFormData(ind); setShowModal(true); }} className="p-2 text-surface-400 hover:text-white bg-surface-800 rounded">
                    <HiPencilAlt className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(ind._id)} className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 rounded">
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">{formData._id ? 'Edit Industry' : 'New Industry'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Industry Name</label>
                  <input type="text" required value={formData.industryName} onChange={e => setFormData({...formData, industryName: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">URL Slug</label>
                  <input type="text" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded px-3 py-2 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1">Hero Text</label>
                <textarea rows="3" value={formData.heroText} onChange={e => setFormData({...formData, heroText: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded px-3 py-2 text-white"></textarea>
              </div>
              <div className="border-t border-white/10 pt-4 mt-4">
                <h3 className="text-white font-medium mb-3">SEO Meta Data</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-surface-400 mb-1">Meta Title</label>
                    <input type="text" value={formData.seoMeta?.title || ''} onChange={e => setFormData({...formData, seoMeta: {...formData.seoMeta, title: e.target.value}})} className="w-full bg-surface-800 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-400 mb-1">Meta Description</label>
                    <textarea rows="2" value={formData.seoMeta?.description || ''} onChange={e => setFormData({...formData, seoMeta: {...formData.seoMeta, description: e.target.value}})} className="w-full bg-surface-800 border border-white/10 rounded px-3 py-2 text-white text-sm"></textarea>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Industry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminIndustries;
