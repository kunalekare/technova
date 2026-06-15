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

  const dispatch = useDispatch();
  const { categories, services, loading, pagination } = useSelector((state) => state.services);

  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || '-createdAt';
  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
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
  }, [dispatch, currentCategory, currentSort, currentPage, categories]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) params.set('search', search);
    else params.delete('search');
    params.set('page', '1');
    setSearchParams(params);
    const apiParams = { search, sort: currentSort, page: 1, limit: 12 };
    dispatch(fetchServices(apiParams));
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

  return (
    <>
      <Helmet>
        <title>Services — TechNova Solutions</title>
        <meta name="description" content="Browse 16+ categories of technology services including Software Development, AI, Machine Learning, Cloud, Design, and Digital Marketing." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        {/* Header */}
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="text-surface-400 max-w-xl">
              Explore our comprehensive catalog of technology, design, and marketing services.
            </p>
          </motion.div>

          {/* Search & Filter Bar */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                className="input-field pl-12"
                id="services-search-input"
              />
            </form>

            <div className="flex gap-3">
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="input-field !w-auto !py-2 cursor-pointer"
                id="services-sort-select"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden btn-secondary !px-4 !py-2 gap-2"
              >
                <HiFilter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>
        </div>

        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
              <div className="glass-card p-5 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">Categories</h3>
                  {currentCategory && (
                    <button
                      onClick={() => handleCategoryFilter('')}
                      className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
                    >
                      Clear <HiX className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleCategoryFilter(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                        currentCategory === cat.slug
                          ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                          : 'text-surface-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Services Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="glass-card p-6 animate-pulse">
                      <div className="h-4 bg-surface-700 rounded w-24 mb-4" />
                      <div className="h-6 bg-surface-700 rounded w-3/4 mb-3" />
                      <div className="h-16 bg-surface-700 rounded mb-4" />
                      <div className="h-8 bg-surface-700 rounded" />
                    </div>
                  ))}
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-surface-400 text-lg mb-4">No services found</p>
                  <button
                    onClick={() => { setSearch(''); setSearchParams({}); dispatch(fetchServices({ limit: 12 })); }}
                    className="btn-secondary"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-surface-500 mb-6">{pagination.total} services found</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {services.map((service, i) => (
                      <motion.div
                        key={service._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                      >
                        <Link
                          to={`/services/${service._id}`}
                          className="glass-card-hover p-6 flex flex-col h-full group block"
                        >
                          <div className="badge-primary mb-4 self-start text-xs">
                            {service.category?.name || 'Service'}
                          </div>
                          <h3 className="text-base font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-sm text-surface-400 mb-4 flex-1 line-clamp-2">
                            {service.shortDescription || service.description?.substring(0, 100)}
                          </p>
                          <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <HiStar key={s} className={`w-3.5 h-3.5 ${s <= Math.round(service.avgRating || 5) ? 'text-yellow-400' : 'text-surface-600'}`} />
                            ))}
                            <span className="text-xs text-surface-500 ml-1">{service.avgRating || '5.0'}</span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-white/10">
                            <div>
                              <span className="text-xs text-surface-500">From</span>
                              <span className="text-lg font-display font-bold text-white ml-1">
                                ${service.pricingTiers?.[0]?.price || '99'}
                              </span>
                            </div>
                            <HiArrowRight className="w-4 h-4 text-primary-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set('page', String(i + 1));
                            setSearchParams(params);
                          }}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                            pagination.page === i + 1
                              ? 'bg-primary-500 text-white'
                              : 'bg-white/5 text-surface-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
