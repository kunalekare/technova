import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminPortfolios, deletePortfolio } from '../../redux/slices/portfolioSlice';
import { 
  HiPlus, HiPencilAlt, HiTrash, HiOutlinePhotograph, HiOutlineStar, 
  HiOutlineBriefcase, HiOutlineLink, HiX, HiOutlineEye, HiOutlineFolderOpen
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const PortfolioManager = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.portfolio || { items: [], loading: false });
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State Mock
  const [portfolioForm, setPortfolioForm] = useState({
    title: '', client: '', category: '', link: '', isFeatured: false, image: ''
  });

  useEffect(() => {
    dispatch(fetchAdminPortfolios());
  }, [dispatch]);

  const handleCreatePortfolio = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Case study added to portfolio!');
      setShowForm(false);
      setPortfolioForm({ title: '', client: '', category: '', link: '', isFeatured: false, image: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  // Stats
  const featuredCount = items.filter(p => p.isFeatured).length;
  const categories = [...new Set(items.map(p => p.category?.name).filter(Boolean))].length;

  return (
    <>
      <Helmet>
        <title>Portfolio Management — Admin | TechNova</title>
      </Helmet>

      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Portfolio Cases</h1>
            <p className="text-surface-400 text-sm mt-1">Manage and highlight your best case studies and past work.</p>
          </div>
          <button 
            className="btn-primary shadow-lg shadow-primary-500/20 flex items-center" 
            onClick={() => setShowForm(true)}
          >
            <HiPlus className="w-5 h-5 mr-2" /> Add Case Study
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <HiOutlineBriefcase className="w-24 h-24 text-white -mt-6 -mr-6" />
            </div>
            <div className="relative z-10">
              <p className="text-xs text-surface-400 font-bold uppercase tracking-wider mb-1">Total Case Studies</p>
              <p className="text-4xl font-display font-bold text-white">{items.length}</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <HiOutlineStar className="w-24 h-24 text-primary-500 -mt-6 -mr-6" />
            </div>
            <div className="relative z-10">
              <p className="text-xs text-surface-400 font-bold uppercase tracking-wider mb-1">Featured Work</p>
              <p className="text-4xl font-display font-bold text-primary-400">{featuredCount}</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <HiOutlineFolderOpen className="w-24 h-24 text-emerald-500 -mt-6 -mr-6" />
            </div>
            <div className="relative z-10">
              <p className="text-xs text-surface-400 font-bold uppercase tracking-wider mb-1">Categories</p>
              <p className="text-4xl font-display font-bold text-emerald-400">{categories || 0}</p>
            </div>
          </div>
        </div>

        {/* Table/Empty State */}
        <div className="glass-card overflow-visible relative rounded-3xl border border-white/5">
          <div className="p-6 border-b border-white/5 bg-surface-900/50 rounded-t-3xl flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">All Projects</h2>
          </div>
          
          {loading ? (
            <div className="p-20 text-center">
              <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-surface-400 font-medium">Loading portfolio...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="py-24 text-center border-dashed rounded-b-3xl">
              <HiOutlineBriefcase className="w-16 h-16 text-surface-600 mx-auto mb-4" />
              <p className="text-xl font-bold text-white mb-2">No case studies found</p>
              <p className="text-surface-400 max-w-sm mx-auto mb-6">Build trust by showcasing your best past projects and client success stories.</p>
              <button className="btn-primary" onClick={() => setShowForm(true)}>Add Your First Case Study</button>
            </div>
          ) : (
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-800/30 border-b border-white/5">
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Project details</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Category</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Client</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Status</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((p) => (
                    <tr key={p._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-4 max-w-sm">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} className="w-16 h-12 rounded-lg object-cover border border-white/10 shadow-md flex-shrink-0" />
                          ) : (
                            <div className="w-16 h-12 rounded-lg bg-surface-800 border border-white/5 flex items-center justify-center flex-shrink-0 text-surface-500 group-hover:text-primary-400 transition-colors">
                              <HiOutlinePhotograph className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-1">{p.title}</p>
                            <p className="text-[11px] font-mono text-surface-500 mt-1 truncate flex items-center gap-1">
                              <HiOutlineLink className="w-3 h-3" /> {p.liveUrl?.replace(/^https?:\/\//, '') || 'No URL'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="bg-surface-800 text-surface-300 px-2.5 py-1 rounded-md text-[11px] font-bold border border-white/5">
                          {p.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="p-5 text-sm text-surface-300 font-medium">{p.client || 'Internal Project'}</td>
                      <td className="p-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                          p.isFeatured 
                            ? 'text-primary-400 bg-primary-500/10 border-primary-500/20' 
                            : 'text-surface-400 bg-surface-500/10 border-surface-500/20'
                        }`}>
                          {p.isFeatured ? <><HiOutlineStar className="w-3 h-3 mr-1" /> Featured</> : 'Standard'}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex justify-end gap-1">
                          <button className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors tooltip-trigger" title="Preview">
                            <HiOutlineEye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-surface-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors tooltip-trigger" title="Edit">
                            <HiPencilAlt className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-surface-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors tooltip-trigger" 
                            title="Delete"
                            onClick={() => dispatch(deletePortfolio(p._id))}
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Portfolio Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => !isSubmitting && setShowForm(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-900 border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-2xl relative z-10 shadow-2xl"
            >
              <button onClick={() => !isSubmitting && setShowForm(false)} className="absolute top-6 right-6 p-2 bg-surface-800 hover:bg-surface-700 text-surface-400 hover:text-white rounded-full transition-colors"><HiX className="w-5 h-5" /></button>
              
              <div className="mb-8">
                <div className="w-12 h-12 bg-primary-500/20 text-primary-400 rounded-2xl flex items-center justify-center mb-4">
                  <HiOutlineBriefcase className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white">Add Case Study</h2>
                <p className="text-surface-400 text-sm mt-1">Showcase your successful projects.</p>
              </div>

              <form onSubmit={handleCreatePortfolio} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Project Title</label>
                    <input
                      type="text" required
                      value={portfolioForm.title} onChange={e => setPortfolioForm({...portfolioForm, title: e.target.value})}
                      className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors"
                      placeholder="e.g. NextGen E-Commerce Redesign"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Client Name</label>
                    <input
                      type="text" required
                      value={portfolioForm.client} onChange={e => setPortfolioForm({...portfolioForm, client: e.target.value})}
                      className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors"
                      placeholder="e.g. Acme Corp"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Category ID (Mock)</label>
                    <input
                      type="text" required
                      value={portfolioForm.category} onChange={e => setPortfolioForm({...portfolioForm, category: e.target.value})}
                      className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors"
                      placeholder="categoryId..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Live URL</label>
                    <input
                      type="url"
                      value={portfolioForm.link} onChange={e => setPortfolioForm({...portfolioForm, link: e.target.value})}
                      className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors"
                      placeholder="https://acmecorp.com"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Cover Image URL</label>
                    <input
                      type="url"
                      value={portfolioForm.image} onChange={e => setPortfolioForm({...portfolioForm, image: e.target.value})}
                      className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center justify-between p-4 bg-surface-800/50 rounded-xl border border-white/5">
                    <div>
                      <h4 className="text-white font-medium">Feature this Project</h4>
                      <p className="text-xs text-surface-400 mt-0.5">Featured projects show up on the homepage</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={portfolioForm.isFeatured}
                        onChange={e => setPortfolioForm({...portfolioForm, isFeatured: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-4 mt-8">
                  <button type="button" onClick={() => !isSubmitting && setShowForm(false)} className="flex-1 py-3 px-4 bg-surface-800 hover:bg-surface-700 text-white rounded-xl font-medium transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center justify-center">
                    {isSubmitting ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Save Case Study'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PortfolioManager;
