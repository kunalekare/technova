import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHeart, HiStar, HiArrowRight, HiShoppingCart } from 'react-icons/hi';
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
        <title>My Wishlist — TechNova</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">My Wishlist</h1>
          <p className="text-surface-400 text-sm mt-1">Services you've saved for later</p>
        </div>

        {loading ? (
          <div className="glass-card p-12 text-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-surface-400 text-sm">Loading wishlist...</p>
          </div>
        ) : wishlist?.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <HiHeart className="w-14 h-14 text-surface-600 mx-auto mb-3" />
            <p className="text-surface-400 font-medium text-lg">Your wishlist is empty</p>
            <p className="text-surface-500 text-sm mt-1 mb-6">Browse our services and save the ones you like!</p>
            <Link to="/services" className="btn-primary text-sm !px-6">
              <HiShoppingCart className="w-4 h-4 mr-2" />
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {wishlist.map((service, i) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card overflow-hidden group"
              >
                {/* Service Image */}
                <div className="relative h-40 bg-gradient-to-br from-primary-900/50 to-surface-900 overflow-hidden">
                  {service.images?.[0] ? (
                    <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                        <HiShoppingCart className="w-8 h-8 text-primary-400" />
                      </div>
                    </div>
                  )}
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(service._id)}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-surface-950/80 backdrop-blur-sm text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                    title="Remove from wishlist"
                  >
                    <HiHeart className="w-5 h-5 fill-current" />
                  </button>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                    {service.title}
                  </h3>
                  <p className="text-sm text-surface-400 mt-1 line-clamp-2">
                    {service.shortDescription || service.description?.substring(0, 100)}
                  </p>

                  {/* Rating */}
                  {service.avgRating > 0 && (
                    <div className="flex items-center gap-1.5 mt-3">
                      <HiStar className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-medium text-white">{service.avgRating.toFixed(1)}</span>
                      <span className="text-xs text-surface-500">({service.totalReviews} reviews)</span>
                    </div>
                  )}

                  {/* Price */}
                  {service.pricingTiers?.[0] && (
                    <p className="mt-3 text-lg font-display font-bold text-primary-400">
                      ₹{service.pricingTiers[0].price.toLocaleString()}
                      <span className="text-xs text-surface-500 font-normal ml-1">starting</span>
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                    <Link
                      to={`/services/${service._id}`}
                      className="flex-1 btn-primary text-xs !px-4 !py-2 text-center"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleRemove(service._id)}
                      className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                      title="Remove"
                    >
                      <HiHeart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;
