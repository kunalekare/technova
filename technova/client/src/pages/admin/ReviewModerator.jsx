import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingReviews, moderateReview } from '../../redux/slices/adminSlice';
import { HiCheck, HiX, HiStar } from 'react-icons/hi';
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
      toast.success(`Review ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
    } catch (err) {
      toast.error('Failed to process review');
    }
  };

  return (
    <>
      <Helmet>
        <title>Review Moderation — TechNova Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Review Moderation</h1>
            <p className="text-surface-400 text-sm mt-1">Approve or reject client reviews before they go public.</p>
          </div>
          <div className="bg-surface-900 px-4 py-2 rounded-lg border border-white/10 text-sm text-white">
            <span className="font-bold text-primary-400 mr-2">{pendingReviews.length}</span> Pending Reviews
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-surface-400 glass-card">Loading reviews...</div>
          ) : pendingReviews.length === 0 ? (
            <div className="p-16 text-center text-surface-400 glass-card flex flex-col items-center">
              <HiStar className="w-12 h-12 text-surface-600 mb-3" />
              <p className="text-lg text-white font-medium">All caught up!</p>
              <p className="text-sm mt-1">No pending reviews require moderation.</p>
            </div>
          ) : (
            pendingReviews.map(review => (
              <div key={review._id} className="glass-card p-6 flex flex-col md:flex-row gap-6 hover:border-primary-500/20 transition-colors">
                <div className="w-16 flex-shrink-0">
                  {review.user?.avatar ? (
                    <img src={review.user.avatar} alt="" className="w-12 h-12 rounded-full object-cover border border-white/10" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-white text-lg border border-white/10">
                      {review.user?.name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-white">{review.user?.name}</h3>
                      <p className="text-xs text-surface-400">On: {review.service?.title}</p>
                    </div>
                    <div className="text-xs text-surface-500">
                      {format(new Date(review.createdAt), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                  
                  <div className="flex text-amber-400 my-2">
                    {[1,2,3,4,5].map(star => (
                      <HiStar key={star} className={star <= review.rating ? 'text-amber-400' : 'text-surface-700'} />
                    ))}
                  </div>
                  
                  <p className="text-surface-300 text-sm leading-relaxed bg-surface-900/50 p-4 rounded-lg border border-white/5 italic">
                    "{review.comment}"
                  </p>
                </div>
                
                <div className="flex flex-row md:flex-col gap-2 md:w-32 flex-shrink-0">
                  <button 
                    onClick={() => handleAction(review._id, 'approve')}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg py-2 px-3 text-sm font-medium transition-colors"
                  >
                    <HiCheck className="w-4 h-4" /> Approve
                  </button>
                  <button 
                    onClick={() => handleAction(review._id, 'reject')}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg py-2 px-3 text-sm font-medium transition-colors"
                  >
                    <HiX className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewModerator;
