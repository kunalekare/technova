import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiStar, HiCheck, HiClock, HiArrowRight, HiShoppingCart } from 'react-icons/hi';
import { fetchServiceById, clearCurrentService } from '../../redux/slices/serviceSlice';

const tierColors = {
  Basic: 'from-surface-600 to-surface-700',
  Standard: 'from-primary-600 to-primary-700',
  Premium: 'from-accent-600 to-accent-700',
};

const ServiceDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentService: service, reviews, relatedServices, loading } = useSelector((state) => state.services);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchServiceById(id));
    return () => { dispatch(clearCurrentService()); };
  }, [dispatch, id]);

  if (loading || !service) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-8 bg-surface-700 rounded w-1/3 mb-4" />
          <div className="h-4 bg-surface-700 rounded w-1/2 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-surface-800 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{service.title} — TechNova Solutions</title>
        <meta name="description" content={service.shortDescription || service.description?.substring(0, 160)} />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-surface-400 mb-8">
            <Link to="/services" className="hover:text-primary-400 transition-colors">Services</Link>
            <span>/</span>
            <Link to={`/services?category=${service.category?.slug}`} className="hover:text-primary-400 transition-colors">{service.category?.name}</Link>
            <span>/</span>
            <span className="text-surface-300">{service.title}</span>
          </motion.div>

          {/* Title & Rating */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="badge-primary mb-4">{service.category?.name}</div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">{service.title}</h1>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <HiStar key={s} className={`w-5 h-5 ${s <= Math.round(service.avgRating || 5) ? 'text-yellow-400' : 'text-surface-600'}`} />
                ))}
                <span className="text-surface-300 ml-2">{service.avgRating || '5.0'} ({service.totalReviews || 0} reviews)</span>
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8 mb-10">
            <h2 className="text-xl font-display font-semibold text-white mb-4">About This Service</h2>
            <p className="text-surface-300 leading-relaxed whitespace-pre-line">{service.description}</p>
            {service.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {service.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-surface-800/50 text-xs text-surface-400 border border-surface-700/50">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Pricing Tiers */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-2xl font-display font-bold text-white mb-6">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {service.pricingTiers?.map((tier, i) => (
                <div
                  key={tier.name}
                  className={`glass-card p-6 flex flex-col relative ${tier.name === 'Standard' ? 'border-primary-500/40 ring-1 ring-primary-500/20' : ''}`}
                >
                  {tier.name === 'Standard' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className={`inline-flex self-start px-3 py-1 rounded-lg bg-gradient-to-r ${tierColors[tier.name]} text-white text-sm font-semibold mb-4`}>
                    {tier.name}
                  </div>
                  <div className="text-3xl font-display font-bold text-white mb-1">${tier.price}</div>
                  <div className="flex items-center gap-1 text-sm text-surface-400 mb-6">
                    <HiClock className="w-4 h-4" />
                    {tier.deliveryDays} day delivery
                  </div>
                  <ul className="space-y-3 mb-6 flex-1">
                    {tier.features?.map((feature, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-sm text-surface-300">
                        <HiCheck className="w-4 h-4 text-accent-400 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={isAuthenticated ? `/request?service=${service._id}&tier=${tier.name}` : '/login'}
                    className={`w-full text-center py-3 rounded-xl font-semibold transition-all duration-300 ${
                      tier.name === 'Standard'
                        ? 'btn-primary'
                        : 'btn-secondary'
                    }`}
                  >
                    {isAuthenticated ? 'Request This Service' : 'Login to Request'}
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Reviews */}
          {reviews?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-2xl font-display font-bold text-white mb-6">Client Reviews</h2>
              <div className="space-y-4 mb-10">
                {reviews.map((review) => (
                  <div key={review._id} className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                          {review.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{review.user?.name}</div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <HiStar key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-yellow-400' : 'text-surface-600'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-surface-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Related Services */}
          {relatedServices?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h2 className="text-2xl font-display font-bold text-white mb-6">Related Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedServices.map((rs) => (
                  <Link key={rs._id} to={`/services/${rs._id}`} className="glass-card-hover p-5 group block">
                    <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors">{rs.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">From ${rs.pricingTiers?.[0]?.price}</span>
                      <HiArrowRight className="w-4 h-4 text-primary-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default ServiceDetail;
