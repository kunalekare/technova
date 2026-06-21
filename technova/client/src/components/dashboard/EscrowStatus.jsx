import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyEscrows, disputeEscrow } from '../../redux/slices/escrowSlice';
import { HiCurrencyRupee, HiExclamationCircle, HiCheckCircle } from 'react-icons/hi';
import { format } from 'date-fns';

const EscrowStatus = ({ projectId }) => {
  const dispatch = useDispatch();
  const { escrows, loading } = useSelector((state) => state.escrow);

  useEffect(() => {
    dispatch(fetchMyEscrows());
  }, [dispatch]);

  const projectEscrows = escrows.filter(e => e.order?.project?._id === projectId || e.order?.project === projectId);

  if (loading) {
    return <div className="text-surface-400 text-sm">Loading escrow details...</div>;
  }

  if (projectEscrows.length === 0) {
    return (
      <div className="py-8 text-center bg-surface-900 rounded-xl border border-white/5">
        <HiCurrencyRupee className="w-10 h-10 text-surface-600 mx-auto mb-2" />
        <p className="text-surface-400">No escrow payments found for this project.</p>
      </div>
    );
  }

  const handleDispute = (escrowId) => {
    if (window.confirm('Are you sure you want to dispute this payment? This will freeze the funds until resolved.')) {
      dispatch(disputeEscrow(escrowId));
    }
  };

  return (
    <div className="space-y-4">
      {projectEscrows.map((escrow) => (
        <div key={escrow._id} className="p-5 rounded-xl border border-white/5 bg-surface-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-white font-medium">Payment ID: {escrow._id.slice(-6)}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                escrow.status === 'held' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                escrow.status === 'released' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {escrow.status.charAt(0).toUpperCase() + escrow.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-surface-400">
              Amount: <strong className="text-white">₹{escrow.amount.toLocaleString()}</strong>
            </p>
            <p className="text-xs text-surface-500 mt-1">
              Held on: {format(new Date(escrow.heldAt), 'MMM d, yyyy')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {escrow.status === 'held' && (
              <button 
                onClick={() => handleDispute(escrow._id)}
                className="px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <HiExclamationCircle className="w-4 h-4" />
                Dispute
              </button>
            )}
            {escrow.status === 'released' && (
              <div className="flex items-center gap-1.5 text-emerald-400 text-sm">
                <HiCheckCircle className="w-5 h-5" />
                Funds Released
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EscrowStatus;
