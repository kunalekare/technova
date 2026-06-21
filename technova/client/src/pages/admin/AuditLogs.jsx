import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { HiSearch, HiFilter } from 'react-icons/hi';
import { fetchAuditLogs } from '../../redux/slices/auditSlice';
import { format } from 'date-fns';

const AuditLogs = () => {
  const dispatch = useDispatch();
  const { logs, pagination, loading } = useSelector((state) => state.audit);
  const [filters, setFilters] = useState({ action: '', targetType: '' });

  useEffect(() => {
    dispatch(fetchAuditLogs({ page: 1, ...filters }));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchAuditLogs({ page: newPage, ...filters }));
  };

  return (
    <>
      <Helmet>
        <title>Audit Logs — Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">System Audit Logs</h1>
          <p className="text-surface-400 mt-1">Immutable record of platform activities and mutations.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-xs">
            <HiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <select
              name="action"
              value={filters.action}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-4 py-2 bg-surface-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 appearance-none"
            >
              <option value="">All Actions</option>
              <option value="UPDATE_STATUS">Update Status</option>
              <option value="RELEASE_FUNDS">Release Funds</option>
              <option value="UPDATE_VERIFICATION_STATUS">Update Verification</option>
              <option value="CREATE_ORDER">Create Order</option>
            </select>
          </div>
          <div className="relative flex-1 max-w-xs">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <select
              name="targetType"
              value={filters.targetType}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-4 py-2 bg-surface-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 appearance-none"
            >
              <option value="">All Target Types</option>
              <option value="EscrowTransaction">Escrow</option>
              <option value="BusinessVerification">Verification</option>
              <option value="Project">Project</option>
              <option value="Order">Order</option>
            </select>
          </div>
        </div>

        {loading && logs.length === 0 ? (
          <div className="text-surface-400">Loading audit logs...</div>
        ) : (
          <div className="bg-surface-900 border border-white/5 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-surface-800/50 text-surface-400 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-medium">Timestamp</th>
                    <th className="px-6 py-4 font-medium">Actor</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                    <th className="px-6 py-4 font-medium">Target</th>
                    <th className="px-6 py-4 font-medium">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-surface-400 text-xs">
                        {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss')}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {log.actor?.name || 'System / Anonymous'}
                        <div className="text-xs text-surface-500">{log.actor?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-surface-800 text-primary-400 border border-white/5">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-surface-300">
                        {log.targetType} <span className="text-surface-500 text-xs">({log.targetId?.slice(-6)})</span>
                      </td>
                      <td className="px-6 py-4 text-surface-400 font-mono text-xs">{log.ipAddress || 'N/A'}</td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-surface-500">
                        No audit logs found matching criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-sm text-surface-400">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <div className="space-x-2">
                  <button 
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className="px-3 py-1 bg-surface-800 text-white rounded text-sm disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button 
                    disabled={pagination.page === pagination.pages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className="px-3 py-1 bg-surface-800 text-white rounded text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AuditLogs;
