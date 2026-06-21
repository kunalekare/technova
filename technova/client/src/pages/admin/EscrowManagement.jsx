import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { HiCurrencyRupee, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import { fetchAllEscrows, releaseEscrow } from '../../redux/slices/escrowSlice';
import { format } from 'date-fns';

const EscrowManagement = () => {
  const dispatch = useDispatch();
  const { escrows, loading } = useSelector((state) => state.escrow);

  useEffect(() => {
    dispatch(fetchAllEscrows());
  }, [dispatch]);

  const handleRelease = (id) => {
    if (window.confirm('Are you sure you want to release these funds to the agency? This action cannot be undone.')) {
      dispatch(releaseEscrow(id));
    }
  };

  return (
    <>
      <Helmet>
        <title>Escrow Management — Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Escrow Management</h1>
          <p className="text-surface-400 mt-1">Manage platform escrow funds and milestone releases.</p>
        </div>

        {loading ? (
          <div className="text-surface-400">Loading escrows...</div>
        ) : (
          <div className="bg-surface-900 border border-white/5 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-surface-800/50 text-surface-400 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-medium">Transaction ID</th>
                    <th className="px-6 py-4 font-medium">Client</th>
                    <th className="px-6 py-4 font-medium">Project</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Date Held</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {escrows.map((escrow) => (
                    <tr key={escrow._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-surface-300 font-mono text-xs">{escrow._id}</td>
                      <td className="px-6 py-4 text-white">
                        {escrow.order?.user?.name || 'Unknown'}
                        <div className="text-xs text-surface-500">{escrow.order?.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-surface-300">{escrow.order?.project?.title || 'Unknown'}</td>
                      <td className="px-6 py-4 text-white font-medium">₹{escrow.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          escrow.status === 'held' ? 'bg-amber-500/10 text-amber-400' :
                          escrow.status === 'released' ? 'bg-emerald-500/10 text-emerald-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {escrow.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-surface-400">{format(new Date(escrow.heldAt), 'MMM d, yyyy')}</td>
                      <td className="px-6 py-4 text-right">
                        {escrow.status === 'held' && (
                          <button
                            onClick={() => handleRelease(escrow._id)}
                            className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-xs font-medium transition-colors"
                          >
                            Release Funds
                          </button>
                        )}
                        {escrow.status === 'disputed' && (
                          <button className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-medium transition-colors">
                            Resolve Dispute
                          </button>
                        )}
                        {escrow.status === 'released' && (
                          <span className="text-xs text-surface-500">Released</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {escrows.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-surface-500">
                        No escrow transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EscrowManagement;
