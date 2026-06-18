import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiHeart, HiStar, HiShoppingCart, HiOutlineTrash, HiOutlineSparkles } from 'react-icons/hi';
import { fetchWishlist, toggleWishlist } from '../../redux/slices/userSlice';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = async (serviceId) => {
    const result = await dispatch(toggleWishlist(serviceId));
    if (toggleWishlist.fulfilled.match(result)) {
      toast.success('Removed from wishlist');
      dispatch(fetchWishlist());
    }
  };

  return (
    <>
      <Helmet>
        <title>My Wishlist | TechNova</title>
      </Helmet>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header section with glow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-surface-900/50 p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-inner">
              <HiHeart className="w-7 h-7 text-pink-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">My Wishlist</h1>
              <p className="text-surface-400 mt-1">Saved services and digital assets for future projects.</p>
            </div>
          </div>
          <Link to="/services" className="btn-primary relative z-10 !px-8 !py-4 shadow-lg shadow-primary-500/20 flex items-center gap-2 text-base">
            <HiShoppingCart className="w-5 h-5" /> Browse Market
          </Link>
        </div>

        {loading ? (
          <div className="glass-card p-20 text-center rounded-3xl border border-white/5">
            <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-6" />
            <p className="text-surface-400 font-medium text-lg">Loading your saved collection...</p>
          </div>
        ) : wishlist?.length === 0 ? (
          <div className="glass-card p-20 text-center rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-[80px]" />
            <div className="w-24 h-24 bg-surface-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 relative z-10 border border-white/5 rotate-3">
              <HiHeart className="w-12 h-12 text-surface-500 -rotate-3" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white relative z-10">Your Wishlist is Empty</h3>
            <p className="text-surface-400 mt-2 max-w-sm mx-auto relative z-10">Discover our premium digital services and save the ones you love to plan your next project.</p>
            <Link to="/services" className="mt-8 btn-primary inline-flex relative z-10 shadow-lg shadow-primary-500/20 px-8 py-4 text-lg items-center gap-2">
              <HiOutlineSparkles className="w-5 h-5" /> Explore Services
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {wishlist.map((service, i) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card overflow-hidden group rounded-3xl border border-white/5 hover:border-white/10 hover:bg-surface-800/80 transition-all duration-300 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-900/50 pointer-events-none z-10" />
                  
                  {/* Service Image */}
                  <div className="relative h-48 bg-surface-900 overflow-hidden">
                    {service.images?.[0] ? (
                      <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900/50 to-surface-900">
                        <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
                          <HiShoppingCart className="w-8 h-8 text-primary-400" />
                        </div>
                      </div>
                    )}
                    {/* Floating Remove Button */}
                    <button
                      onClick={(e) => { e.preventDefault(); handleRemove(service._id); }}
                      className="absolute top-4 right-4 z-20 w-10 h-10 rounded-xl bg-surface-950/80 backdrop-blur-md text-pink-500 hover:text-white hover:bg-pink-500/90 transition-all shadow-lg flex items-center justify-center group/btn border border-white/10 hover:border-pink-500"
                      title="Remove from wishlist"
                    >
                      <HiHeart className="w-5 h-5 fill-current group-hover/btn:scale-90 transition-transform" />
                    </button>
                    {/* Floating Rating */}
                    {service.avgRating > 0 && (
                      <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-surface-950/80 backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-lg">
                        <HiStar className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-bold text-white">{service.avgRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 relative z-20">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors line-clamp-1 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-surface-400 line-clamp-2 leading-relaxed h-10">
                      {service.shortDescription || service.description?.substring(0, 100)}
                    </p>

                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                      {/* Price */}
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-surface-500 mb-0.5">Starting At</span>
                        {service.pricingTiers?.[0] ? (
                          <p className="text-xl font-display font-bold text-white">
                            ₹{service.pricingTiers[0].price.toLocaleString()}
                          </p>
                        ) : (
                          <p className="text-sm text-surface-400 italic">Custom Quote</p>
                        )}
                      </div>

                      {/* Actions */}
                      <Link
                        to={`/services/${service._id}`}
                        className="px-6 py-2.5 bg-primary-500/10 hover:bg-primary-500 text-primary-400 hover:text-white rounded-xl font-bold transition-all border border-primary-500/20 hover:border-primary-500"
                      >
                        View Service
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;
