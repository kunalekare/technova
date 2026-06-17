import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingReviews, moderateReview } from '../../redux/slices/adminSlice';
import { HiCheck, HiX, HiStar, HiOutlineSparkles, HiOutlineChatAlt2 } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ReviewModerator = () => {
  const dispatch = useDispatch();
  const { pendingReviews, loading } = useSelector((state) => state.admin || { pendingReviews: [], loading: false });

  useEffect(() => {
    dispatch(fetchPendingReviews());
  }, [dispatch]);

  const handleAction = async (id, action) => {
    try {
      await dispatch(moderateReview({ reviewId: id, action })).unwrap();
      toast.success(
        action === 'approve' 
          ? 'Review approved and published publicly!' 
          : 'Review rejected and removed.'
      );
    } catch (err) {
      toast.error('Failed to process review');
    }
  };

  return (
    <>
      <Helmet>
        <title>Review Moderation — Admin | TechNova</title>
      </Helmet>

      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Review Moderation</h1>
            <p className="text-surface-400 text-sm mt-1">Approve or reject client testimonials before they go live on the platform.</p>
          </div>
          <div className="glass-card px-5 py-2.5 rounded-xl border border-white/10 text-sm text-white flex items-center shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse mr-3"></span>
            <span className="font-bold text-amber-400 text-lg mr-2">{pendingReviews.length}</span> 
            <span className="text-surface-400 font-medium">Pending Reviews</span>
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            // Loading Skeletons
            [...Array(3)].map((_, i) => (
              <div key={i} className="glass-card p-6 rounded-3xl animate-pulse flex gap-6">
                <div className="w-16 h-16 rounded-2xl bg-surface-800 shrink-0" />
                <div className="flex-1 space-y-4">
                  <div className="h-4 bg-surface-800 rounded w-1/4" />
                  <div className="h-3 bg-surface-800 rounded w-1/3" />
                  <div className="h-20 bg-surface-800 rounded-xl w-full" />
                </div>
                <div className="w-32 space-y-2">
                  <div className="h-10 bg-surface-800 rounded-xl" />
                  <div className="h-10 bg-surface-800 rounded-xl" />
                </div>
              </div>
            ))
          ) : pendingReviews.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="py-32 text-center glass-card rounded-3xl relative overflow-hidden flex flex-col items-center justify-center border border-white/5"
            >
              {/* Background glows */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />
              
              <div className="w-20 h-20 bg-surface-800/80 rounded-3xl border border-white/10 flex items-center justify-center mb-6 relative z-10 shadow-2xl">
                <HiOutlineSparkles className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-2 relative z-10">Inbox Zero!</h2>
              <p className="text-surface-400 text-lg relative z-10">You're all caught up. No pending reviews to moderate.</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {pendingReviews.map((review, i) => (
                <motion.div 
                  key={review._id} 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }} transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 sm:gap-8 group hover:border-white/10 transition-colors shadow-xl relative overflow-hidden"
                >
                  {/* Subtle top border gradient */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/50 via-primary-500/50 to-transparent opacity-50" />

                  <div className="w-16 sm:w-20 flex-shrink-0">
                    {review.user?.avatar ? (
                      <img src={review.user.avatar} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-white/10 shadow-lg" />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-surface-800 to-surface-700 flex items-center justify-center font-bold text-white text-2xl border border-white/5 shadow-lg group-hover:from-primary-600 group-hover:to-primary-500 transition-all">
                        {review.user?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{review.user?.name || 'Anonymous Client'}</h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="bg-primary-500/20 text-primary-400 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-primary-500/20">
                            Service
                          </span>
                          <p className="text-sm text-surface-300 font-medium truncate">{review.service?.title || 'General Service'}</p>
                        </div>
                      </div>
                      <div className="text-xs font-medium text-surface-500 flex items-center gap-1.5 bg-surface-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                        <HiOutlineChatAlt2 className="w-4 h-4" />
                        {format(new Date(review.createdAt), 'MMM d, yyyy • h:mm a')}
                      </div>
                    </div>
                    
                    <div className="flex text-amber-400 mb-4">
                      {[1,2,3,4,5].map(star => (
                        <HiStar key={star} className={`w-5 h-5 ${star <= review.rating ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-surface-700'}`} />
                      ))}
                    </div>
                    
                    <div className="relative">
                      <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50 rounded-full" />
                      <p className="text-surface-300 leading-relaxed bg-surface-900/50 p-5 pl-7 rounded-2xl border border-white/5 text-[15px] italic">
                        "{review.comment}"
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col gap-3 md:w-36 flex-shrink-0 justify-center">
                    <button 
                      onClick={() => handleAction(review._id, 'approve')}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-surface-900 shadow-lg shadow-emerald-500/20 rounded-xl py-3 px-4 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <HiCheck className="w-5 h-5" /> Approve
                    </button>
                    <button 
                      onClick={() => handleAction(review._id, 'reject')}
                      className="flex-1 flex items-center justify-center gap-2 bg-surface-800 hover:bg-red-500/10 text-surface-300 hover:text-red-400 border border-white/5 hover:border-red-500/30 rounded-xl py-3 px-4 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <HiX className="w-5 h-5" /> Reject
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewModerator;
