import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices, fetchCategories } from '../../redux/slices/serviceSlice';
import { HiPlus, HiPencilAlt, HiTrash, HiCheck, HiX, HiExternalLink, HiOutlineCollection, HiOutlineTemplate } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ServicesManager = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { services, categories, loading } = useSelector((state) => state.services);
  const [activeTab, setActiveTab] = useState('services');
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ _id: '', name: '', slug: '', icon: '', description: '' });
  
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceForm, setServiceForm] = useState({ _id: '', title: '', description: '', shortDescription: '', category: '', price: '', deliveryDays: '', isActive: true, internalCostEstimate: '', isInternational: false });
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchServices({ limit: 100 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenCategoryModal = (cat = null) => {
    if (cat) {
      setCategoryForm({ _id: cat._id, name: cat.name, slug: cat.slug, icon: cat.icon || '', description: cat.description || '' });
    } else {
      setCategoryForm({ _id: '', name: '', slug: '', icon: '', description: '' });
    }
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (categoryForm._id) {
        await api.put(`/admin/categories/${categoryForm._id}`, categoryForm);
        toast.success('Category updated successfully');
      } else {
        await api.post('/admin/categories', categoryForm);
        toast.success('Category created successfully');
      }
      setShowCategoryModal(false);
      dispatch(fetchCategories());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success('Category deleted');
      dispatch(fetchCategories());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleOpenServiceModal = (srv = null) => {
    if (srv) {
      setServiceForm({
        _id: srv._id,
        title: srv.title,
        description: srv.description,
        shortDescription: srv.shortDescription || '',
        category: srv.category?._id || srv.category,
        price: srv.pricingTiers?.[0]?.price || '',
        deliveryDays: srv.pricingTiers?.[0]?.deliveryDays || '',
        isActive: srv.isActive,
        internalCostEstimate: srv.internalCostEstimate || '',
        isInternational: srv.isInternational || false
      });
    } else {
      setServiceForm({ _id: '', title: '', description: '', shortDescription: '', category: categories[0]?._id || '', price: '', deliveryDays: '', isActive: true, internalCostEstimate: '', isInternational: false });
    }
    setShowServiceModal(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: serviceForm.title,
        description: serviceForm.description,
        shortDescription: serviceForm.shortDescription,
        category: serviceForm.category,
        isActive: serviceForm.isActive,
        internalCostEstimate: Number(serviceForm.internalCostEstimate) || null,
        isInternational: serviceForm.isInternational,
        pricingTiers: [{
          name: 'Basic',
          price: Number(serviceForm.price),
          deliveryDays: Number(serviceForm.deliveryDays),
          features: ['Standard feature 1', 'Standard feature 2']
        }]
      };

      if (serviceForm._id) {
        await api.put(`/admin/services/${serviceForm._id}`, payload);
        toast.success('Service updated successfully');
      } else {
        await api.post('/admin/services', payload);
        toast.success('Service created successfully');
      }
      setShowServiceModal(false);
      dispatch(fetchServices({ limit: 100 }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/admin/services/${id}`);
      toast.success('Service deleted');
      dispatch(fetchServices({ limit: 100 }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete service');
    }
  };

  return (
    <>
      <Helmet>
        <title>Service Catalogue — Admin | TechNova</title>
      </Helmet>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Service Catalogue</h1>
            <p className="text-surface-400 text-sm mt-1">Manage and configure your service offerings and categorizations.</p>
          </div>
          <button 
            className="btn-primary shadow-lg shadow-primary-500/20" 
            onClick={() => activeTab === 'services' ? handleOpenServiceModal() : handleOpenCategoryModal()}
          >
            <HiPlus className="w-5 h-5 mr-1" /> Add {activeTab === 'services' ? 'Service' : 'Category'}
          </button>
        </div>

        <div className="glass-card overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-8 border-b border-white/5 px-6 pt-4 bg-surface-900/50">
            <button
              onClick={() => setActiveTab('services')}
              className={`pb-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === 'services'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-surface-400 hover:text-white'
              }`}
            >
              <HiOutlineTemplate className="w-4 h-4" /> Services ({services?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`pb-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === 'categories'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-surface-400 hover:text-white'
              }`}
            >
              <HiOutlineCollection className="w-4 h-4" /> Categories ({categories?.length || 0})
            </button>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-surface-400">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm">Loading catalogue...</p>
              </div>
            ) : activeTab === 'services' ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-800/30 border-b border-white/5">
                    <th className="px-6 py-4 text-xs font-bold text-surface-400 uppercase tracking-wider w-2/5">Service details</th>
                    <th className="px-6 py-4 text-xs font-bold text-surface-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-surface-400 uppercase tracking-wider">Pricing Tier</th>
                    <th className="px-6 py-4 text-xs font-bold text-surface-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-surface-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {services?.map((s) => (
                    <tr key={s._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {s.coverImage ? (
                            <img src={s.coverImage} alt="" className="w-14 h-10 object-cover rounded-lg border border-white/10 shadow-sm" />
                          ) : (
                            <div className="w-14 h-10 rounded-lg border border-white/10 bg-surface-800 flex items-center justify-center text-xs font-medium text-surface-500 shadow-sm">No Img</div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white truncate">{s.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-amber-400 text-xs flex items-center">★ {s.avgRating?.toFixed(1) || '0.0'}</span>
                              <span className="text-surface-500 text-xs">({s.totalReviews || 0} reviews)</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-surface-800 border border-white/5 text-surface-300">
                          {s.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-surface-300 font-medium">
                          {s.pricingTiers?.length > 0 ? `$${s.pricingTiers[0].price.toLocaleString()}` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {s.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-surface-500/10 text-surface-400 border border-surface-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-surface-500 mr-1.5"></span> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => window.open(`/services/${s._id}`, '_blank')} className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-all" title="View Public Page">
                            <HiExternalLink className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleOpenServiceModal(s)} className="p-2 text-surface-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all" title="Edit Service">
                            <HiPencilAlt className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteService(s._id)} className="p-2 text-surface-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete Service">
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {services?.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-surface-800 flex items-center justify-center mb-4">
                            <HiOutlineTemplate className="w-8 h-8 text-surface-500" />
                          </div>
                          <h3 className="text-white font-medium mb-1">No services yet</h3>
                          <p className="text-surface-400 text-sm">Get started by creating your first service offering.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-800/30 border-b border-white/5">
                    <th className="px-6 py-4 text-xs font-bold text-surface-400 uppercase tracking-wider w-1/3">Category Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-surface-400 uppercase tracking-wider">Slug</th>
                    <th className="px-6 py-4 text-xs font-bold text-surface-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-xs font-bold text-surface-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {categories?.map((c) => (
                    <tr key={c._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-surface-800 to-surface-900 border border-white/5 flex items-center justify-center text-primary-400 shadow-inner" dangerouslySetInnerHTML={{ __html: c.icon || '<span>—</span>' }} />
                          <p className="text-sm font-semibold text-white">{c.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-surface-400 bg-surface-900 px-2 py-1 rounded border border-white/5">{c.slug}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-surface-400 truncate max-w-sm" title={c.description}>{c.description || <span className="italic opacity-50">No description</span>}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => window.open(`/services?category=${c.slug}`, '_blank')} className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-all" title="View Public Page">
                            <HiExternalLink className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleOpenCategoryModal(c)} className="p-2 text-surface-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all" title="Edit Category">
                            <HiPencilAlt className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteCategory(c._id)} className="p-2 text-surface-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete Category">
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {categories?.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-surface-800 flex items-center justify-center mb-4">
                            <HiOutlineCollection className="w-8 h-8 text-surface-500" />
                          </div>
                          <h3 className="text-white font-medium mb-1">No categories yet</h3>
                          <p className="text-surface-400 text-sm">Organize your services by adding categories.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowCategoryModal(false)} />
          <div className="bg-surface-900 border border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-md relative z-10 shadow-2xl transform transition-all">
            <button onClick={() => setShowCategoryModal(false)} className="absolute top-6 right-6 text-surface-400 hover:text-white bg-surface-800 hover:bg-surface-700 rounded-full p-1.5 transition-colors">
              <HiX className="w-5 h-5" />
            </button>
            
            <div className="mb-6">
              <h2 className="text-xl font-display font-bold text-white">{categoryForm._id ? 'Edit Category' : 'Create New Category'}</h2>
              <p className="text-surface-400 text-sm mt-1">Organize your services visually and semantically.</p>
            </div>
            
            <form onSubmit={handleSaveCategory} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">Category Name</label>
                <input required type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors" placeholder="e.g. Graphic Design" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">URL Slug</label>
                <input required type="text" value={categoryForm.slug} onChange={e => setCategoryForm({...categoryForm, slug: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors font-mono text-sm" placeholder="e.g. graphic-design" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">SVG Icon Code</label>
                <input type="text" value={categoryForm.icon} onChange={e => setCategoryForm({...categoryForm, icon: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors font-mono text-xs" placeholder="<svg>...</svg>" />
                <p className="text-xs text-surface-500 mt-1.5">Paste an SVG string to display beautifully beside the category.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">Description</label>
                <textarea value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors resize-none" rows="3" placeholder="Category description..."></textarea>
              </div>
              
              <div className="pt-4 border-t border-white/5 flex gap-3">
                <button type="button" onClick={() => setShowCategoryModal(false)} className="flex-1 py-2.5 px-4 bg-surface-800 hover:bg-surface-700 text-white rounded-xl text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 px-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowServiceModal(false)} />
          <div className="bg-surface-900 border border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-2xl relative z-10 shadow-2xl my-8 transform transition-all">
            <button onClick={() => setShowServiceModal(false)} className="absolute top-6 right-6 text-surface-400 hover:text-white bg-surface-800 hover:bg-surface-700 rounded-full p-1.5 transition-colors">
              <HiX className="w-5 h-5" />
            </button>
            
            <div className="mb-6">
              <h2 className="text-xl font-display font-bold text-white">{serviceForm._id ? 'Edit Service' : 'Create New Service'}</h2>
              <p className="text-surface-400 text-sm mt-1">Provide clear, structured details to attract clients.</p>
            </div>
            
            <form onSubmit={handleSaveService} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Service Title</label>
                  <input required type="text" value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors" placeholder="e.g. Logo Design" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Category</label>
                  <select required value={serviceForm.category} onChange={e => setServiceForm({...serviceForm, category: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors appearance-none">
                    <option value="" disabled>Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">Short Tagline</label>
                <input required type="text" value={serviceForm.shortDescription} onChange={e => setServiceForm({...serviceForm, shortDescription: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors" placeholder="Brief tagline summarizing the service..." maxLength="200" />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">Full Description</label>
                <textarea required value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors" rows="4" placeholder="Detailed service description outlining benefits, processes, and deliverables..."></textarea>
              </div>

              <div className="p-5 rounded-xl border border-white/5 bg-surface-800/50">
                <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span> Basic Pricing Tier
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Starting Price (USD)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 font-medium">$</span>
                      <input required type="number" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors" placeholder="1000" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Estimated Delivery</label>
                    <div className="relative">
                      <input required type="number" value={serviceForm.deliveryDays} onChange={e => setServiceForm({...serviceForm, deliveryDays: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors" placeholder="14" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 text-sm">Days</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 rounded-xl border border-white/5 bg-surface-800/50">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Internal Cost Estimate (INR)</label>
                  <input type="number" value={serviceForm.internalCostEstimate} onChange={e => setServiceForm({...serviceForm, internalCostEstimate: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors" placeholder="e.g. 5000" />
                  <p className="text-xs text-surface-500 mt-1">For Admin Profitability Tracking</p>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center">
                      <input type="checkbox" id="isInternational" checked={serviceForm.isInternational} onChange={e => setServiceForm({...serviceForm, isInternational: e.target.checked})} className="peer sr-only" />
                      <div className="w-11 h-6 bg-surface-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500 transition-colors cursor-pointer" onClick={() => setServiceForm({...serviceForm, isInternational: !serviceForm.isInternational})}></div>
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="isInternational" className="text-sm font-medium text-white cursor-pointer" onClick={() => setServiceForm({...serviceForm, isInternational: !serviceForm.isInternational})}>International Ready</label>
                      <span className="text-xs text-surface-400">Enable multi-currency purchasing for this service.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-surface-800/50 p-4 rounded-xl border border-white/5">
                <div className="relative flex items-center">
                  <input type="checkbox" id="isActive" checked={serviceForm.isActive} onChange={e => setServiceForm({...serviceForm, isActive: e.target.checked})} className="peer sr-only" />
                  <div className="w-11 h-6 bg-surface-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500 transition-colors cursor-pointer" onClick={() => setServiceForm({...serviceForm, isActive: !serviceForm.isActive})}></div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="isActive" className="text-sm font-medium text-white cursor-pointer" onClick={() => setServiceForm({...serviceForm, isActive: !serviceForm.isActive})}>Active Status</label>
                  <span className="text-xs text-surface-400">Make this service immediately visible to the public.</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-3">
                <button type="button" onClick={() => setShowServiceModal(false)} className="flex-1 py-3 px-4 bg-surface-800 hover:bg-surface-700 text-white rounded-xl text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : 'Publish Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesManager;
