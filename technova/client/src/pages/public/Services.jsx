import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiSearch, HiStar, HiArrowRight, HiFilter, HiX } from 'react-icons/hi';
import { fetchCategories, fetchServices } from '../../redux/slices/serviceSlice';

const sortOptions = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customForm, setCustomForm] = useState({ name: '', email: '', company: '', serviceName: '', description: '', budget: '' });
  const [customSubmitStatus, setCustomSubmitStatus] = useState('idle'); // idle, loading, success, error
  const [customSubmitMessage, setCustomSubmitMessage] = useState('');

  const dispatch = useDispatch();
  const { categories, services, loading, pagination } = useSelector((state) => state.services);
  const { user } = useSelector((state) => state.auth);

  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || '-createdAt';
  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setCustomForm(prev => ({ ...prev, name: user.name || '', email: user.email || '' }));
    }
  }, [user]);

  useEffect(() => {
    // Prevent race condition: if a category is selected in URL, wait for categories to load first
    if (currentCategory && categories.length === 0) return;

    const params = {};
    if (currentCategory) {
      const cat = categories.find((c) => c.slug === currentCategory);
      if (cat) params.category = cat._id;
    }
    if (search) params.search = search;
    params.sort = currentSort;
    params.page = currentPage;
    params.limit = 12;
    dispatch(fetchServices(params));
  }, [dispatch, currentCategory, currentSort, currentPage, categories, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) params.set('search', search);
    else params.delete('search');
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleCategoryFilter = (slug) => {
    const params = new URLSearchParams(searchParams);
    if (slug === currentCategory) params.delete('category');
    else params.set('category', slug);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSortChange = (sort) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sort);
    setSearchParams(params);
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    setCustomSubmitStatus('loading');
    try {
      const res = await fetch('http://localhost:5000/api/v1/custom-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customForm)
      });
      const data = await res.json();
      if (data.success) {
        setCustomSubmitStatus('success');
        setCustomSubmitMessage(data.message);
        setTimeout(() => {
          setShowCustomModal(false);
          setCustomSubmitStatus('idle');
          setCustomForm({ name: '', email: '', company: '', serviceName: '', description: '', budget: '' });
        }, 3000);
      } else {
        setCustomSubmitStatus('error');
        setCustomSubmitMessage(data.message || 'Something went wrong');
      }
    } catch (err) {
      setCustomSubmitStatus('error');
      setCustomSubmitMessage('Failed to submit request');
    }
  };

  const selectedCategoryName = categories.find(c => c.slug === currentCategory)?.name;

  return (
    <>
      <Helmet>
        <title>Services — Velixora Solutions</title>
        <meta name="description" content="Browse our catalog of premium velixoralogy services including Software Engineering, AI, Cloud, Design, and Digital Marketing." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-20 bg-surface-950">
        {/* Dynamic Header */}
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="bg-surface-900 border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative z-10 max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                {selectedCategoryName ? (
                  <>{selectedCategoryName} <span className="gradient-text">Services</span></>
                ) : (
                  <>Explore Our <span className="gradient-text">Premium Services</span></>
                )}
              </h1>
              <p className="text-surface-400 text-lg">
                Discover end-to-end solutions tailored for your business needs. 
                Our experts deliver high-quality results across every discipline.
              </p>

              {/* Advanced Search Bar */}
              <div className="mt-8 flex flex-col lg:flex-row gap-4 bg-surface-950/50 p-2 sm:p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                <form onSubmit={handleSearch} className="flex-1 relative flex items-center w-full">
                  <HiSearch className="absolute left-4 w-5 h-5 text-primary-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by keywords, tags, or service names..."
                    className="w-full bg-transparent border-none focus:ring-0 text-white pl-12 pr-12 py-3 placeholder-surface-500 outline-none"
                    id="services-search-input"
                  />
                  {search && (
                    <button 
                      type="button" 
                      onClick={() => { setSearch(''); handleSearch({ preventDefault: () => {} }); }}
                      className="absolute right-4 text-surface-400 hover:text-white transition"
                    >
                      <HiX className="w-5 h-5" />
                    </button>
                  )}
                </form>

                <div className="h-full w-px bg-white/10 hidden lg:block mx-2" />

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="flex gap-3 w-full sm:w-auto">
                    <select
                      value={currentSort}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="bg-surface-900 lg:bg-transparent text-surface-300 border border-white/10 lg:border-none rounded-xl lg:rounded-none py-3 px-4 outline-none flex-1 sm:flex-none cursor-pointer hover:text-white transition"
                      id="services-sort-select"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-surface-900">{opt.label}</option>
                      ))}
                    </select>
                    
                    <button type="submit" onClick={handleSearch} className="btn-primary !px-6 !py-3 !rounded-xl flex-1 sm:flex-none flex justify-center items-center">
                      Search
                    </button>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => setShowCustomModal(true)} 
                    className="bg-surface-800 hover:bg-surface-700 text-white !px-6 !py-3 !rounded-xl flex justify-center items-center font-medium transition-colors border border-white/10 w-full sm:w-auto"
                  >
                    Custom Request
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Categories */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="glass-card p-6 sticky top-24 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-display font-bold text-white">Categories</h3>
                  {currentCategory && (
                    <button
                      onClick={() => handleCategoryFilter('')}
                      className="text-xs bg-primary-500/20 text-primary-400 px-3 py-1.5 rounded-full hover:bg-primary-500/30 transition-colors font-medium"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
                <div className="block lg:hidden mb-2">
                  <select
                    value={currentCategory}
                    onChange={(e) => handleCategoryFilter(e.target.value)}
                    className="w-full bg-surface-900 text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary-500 transition-colors"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="hidden lg:block space-y-1.5 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                  <button
                    onClick={() => handleCategoryFilter('')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      !currentCategory
                        ? 'bg-gradient-to-r from-primary-500/20 to-transparent text-primary-300 border-l-2 border-primary-500'
                        : 'text-surface-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                  >
                    All Services
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleCategoryFilter(cat.slug)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        currentCategory === cat.slug
                          ? 'bg-gradient-to-r from-primary-500/20 to-transparent text-primary-300 border-l-2 border-primary-500'
                          : 'text-surface-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Services Display Area */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="glass-card p-6 animate-pulse rounded-2xl">
                      <div className="h-6 bg-surface-700 rounded w-1/3 mb-4" />
                      <div className="h-5 bg-surface-700 rounded w-3/4 mb-3" />
                      <div className="h-16 bg-surface-700 rounded mb-4" />
                      <div className="h-10 bg-surface-700 rounded" />
                    </div>
                  ))}
                </div>
              ) : services.length === 0 ? (
                <div className="glass-card p-12 text-center rounded-3xl flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-20 h-20 bg-surface-800 rounded-full flex items-center justify-center mb-6">
                    <HiSearch className="w-10 h-10 text-surface-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Services Found</h3>
                  <p className="text-surface-400 max-w-md mx-auto mb-8">
                    We couldn't find any services matching your search or filter criteria. Try adjusting your keywords or clearing the filters.
                  </p>
                  <button
                    onClick={() => { setSearch(''); setSearchParams({}); dispatch(fetchServices({ limit: 12 })); }}
                    className="btn-primary"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedCategoryName && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-surface-500 font-medium">
                        Showing <span className="text-white">{pagination.total}</span> {pagination.total === 1 ? 'service' : 'services'} in {selectedCategoryName}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {services.map((service, i) => (
                      <motion.div
                        key={service._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className="h-full flex"
                      >
                        <Link
                          to={`/services/${service._id}`}
                          className="glass-card p-6 flex flex-col h-full w-full group rounded-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-500/10 border border-white/5 hover:border-primary-500/30"
                        >
                          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                              <HiArrowRight className="w-4 h-4 text-primary-400 -rotate-45" />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <div className="badge-primary !bg-surface-800 !text-surface-300 !border-white/5 truncate">
                              {service.category?.name || 'Service'}
                            </div>
                            {service.isFeatured && (
                              <div className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] uppercase font-bold tracking-wider rounded-full flex items-center gap-1 flex-shrink-0">
                                <HiStar className="w-3 h-3" /> Featured
                              </div>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2 pr-8 min-h-[56px]">
                            {service.title}
                          </h3>
                          
                          <p className="text-sm text-surface-400 mb-6 flex-1 line-clamp-3 leading-relaxed">
                            {service.shortDescription || service.description?.substring(0, 120) + '...'}
                          </p>
                          
                          <div className="mt-auto pt-5 border-t border-white/5 flex items-end justify-between">
                            <div>
                              <span className="text-xs font-medium text-surface-500 block mb-1 uppercase tracking-wider">Starting At</span>
                              <span className="text-2xl font-display font-bold text-white">
                                ${service.pricingTiers?.[0]?.price || '99'}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1.5 bg-surface-900 px-3 py-1.5 rounded-lg border border-white/5">
                              <HiStar className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm font-semibold text-white">{service.avgRating || '5.0'}</span>
                              <span className="text-xs text-surface-500">({service.totalReviews || 0})</span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex justify-center gap-2 pt-12 border-t border-white/5">
                      {[...Array(pagination.pages)].map((_, i) => (
                         <button
                           key={i}
                           onClick={() => {
                             const params = new URLSearchParams(searchParams);
                             params.set('page', String(i + 1));
                             setSearchParams(params);
                             window.scrollTo({ top: 0, behavior: 'smooth' });
                           }}
                           className={`w-12 h-12 rounded-xl text-sm font-bold transition-all duration-300 ${
                             pagination.page === i + 1
                               ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                               : 'bg-surface-800 text-surface-400 hover:bg-surface-700 hover:text-white border border-white/5'
                           }`}
                         >
                           {i + 1}
                         </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Service Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCustomModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-900 border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-lg relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <button 
              onClick={() => setShowCustomModal(false)}
              className="absolute top-6 right-6 text-surface-400 hover:text-white"
            >
              <HiX className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-display font-bold text-white mb-2">Request Custom Service</h2>
            <p className="text-surface-400 mb-6 text-sm">Tell us what you need and our team will get back to you with a tailored solution.</p>

            {customSubmitStatus === 'success' ? (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-center">
                {customSubmitMessage}
              </div>
            ) : (
              <form onSubmit={handleCustomSubmit} className="space-y-4">
                {customSubmitStatus === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                    {customSubmitMessage}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1">Name</label>
                    <input type="text" required value={customForm.name} onChange={e => setCustomForm({...customForm, name: e.target.value})} className="w-full bg-surface-800 border border-white/5 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1">Email</label>
                    <input type="email" required value={customForm.email} onChange={e => setCustomForm({...customForm, email: e.target.value})} className="w-full bg-surface-800 border border-white/5 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Company (Optional)</label>
                  <input type="text" value={customForm.company} onChange={e => setCustomForm({...customForm, company: e.target.value})} className="w-full bg-surface-800 border border-white/5 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Acme Inc." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Service Needed</label>
                  <input type="text" required value={customForm.serviceName} onChange={e => setCustomForm({...customForm, serviceName: e.target.value})} className="w-full bg-surface-800 border border-white/5 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. 3D Animation, ERP Setup" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Requirements</label>
                  <textarea required value={customForm.description} onChange={e => setCustomForm({...customForm, description: e.target.value})} rows="4" className="w-full bg-surface-800 border border-white/5 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="Describe your project requirements in detail..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Budget (Optional)</label>
                  <input type="text" value={customForm.budget} onChange={e => setCustomForm({...customForm, budget: e.target.value})} className="w-full bg-surface-800 border border-white/5 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. $1000 - $5000" />
                </div>
                <button 
                  type="submit" 
                  disabled={customSubmitStatus === 'loading'}
                  className="btn-primary w-full !py-3 !rounded-xl mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {customSubmitStatus === 'loading' ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Services;
