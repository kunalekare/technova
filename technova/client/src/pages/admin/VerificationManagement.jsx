import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchAllVerifications, updateVerificationStatus } from '../../redux/slices/verificationSlice';
import { format } from 'date-fns';

const VerificationManagement = () => {
  const dispatch = useDispatch();
  const { verifications, loading } = useSelector((state) => state.verification);

  useEffect(() => {
    dispatch(fetchAllVerifications());
  }, [dispatch]);

  const handleUpdateStatus = (id, status) => {
    if (window.confirm(`Are you sure you want to mark this business as ${status}?`)) {
      dispatch(updateVerificationStatus({ id, status }));
    }
  };

  return (
    <>
      <Helmet>
        <title>KYC Management — Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Business KYC Approvals</h1>
          <p className="text-surface-400 mt-1">Review and approve client business verifications.</p>
        </div>

        {loading ? (
          <div className="text-surface-400">Loading verifications...</div>
        ) : (
          <div className="bg-surface-900 border border-white/5 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-surface-800/50 text-surface-400 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-medium">Company Name</th>
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">GST Number</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Submitted On</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {verifications.map((verification) => (
                    <tr key={verification._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-white font-medium">
                        {verification.companyName}
                        {verification.documentUrl && (
                          <a href={verification.documentUrl} target="_blank" rel="noreferrer" className="block text-xs text-primary-400 hover:underline mt-1">
                            View Document
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 text-surface-300">
                        {verification.user?.name || 'Unknown'}
                        <div className="text-xs text-surface-500">{verification.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-surface-300 font-mono text-xs">{verification.gstNumber}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          verification.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                          verification.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {verification.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-surface-400">{format(new Date(verification.createdAt), 'MMM d, yyyy')}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {verification.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(verification._id, 'verified')}
                              className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-xs font-medium transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(verification._id, 'rejected')}
                              className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-medium transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {verification.status !== 'pending' && (
                          <span className="text-xs text-surface-500">
                            Processed by {verification.verifiedBy?.name || 'Admin'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {verifications.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-surface-500">
                        No verification requests found.
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

export default VerificationManagement;
