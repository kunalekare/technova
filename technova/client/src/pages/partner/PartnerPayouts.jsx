import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import { format } from 'date-fns';

const PartnerPayouts = () => {
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/commissions/my')
      .then(res => setLedgers(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Payouts | Partner Portal</title>
      </Helmet>
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Commission Payouts</h1>
        <p className="text-surface-400 mb-8">View your earnings from completed projects.</p>

        {loading ? (
          <p className="text-surface-400">Loading payouts...</p>
        ) : ledgers.length === 0 ? (
          <div className="glass-card p-8 text-center border-white/5 text-surface-400">
            No payouts recorded yet. Complete a project to earn commission!
          </div>
        ) : (
          <div className="glass-card border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-800/50 border-b border-white/5">
                  <tr>
                    <th className="p-4 text-xs font-bold text-surface-400 uppercase tracking-wider">Date</th>
                    <th className="p-4 text-xs font-bold text-surface-400 uppercase tracking-wider">Project</th>
                    <th className="p-4 text-xs font-bold text-surface-400 uppercase tracking-wider">Gross</th>
                    <th className="p-4 text-xs font-bold text-surface-400 uppercase tracking-wider">Net Payout</th>
                    <th className="p-4 text-xs font-bold text-surface-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {ledgers.map(ledger => (
                    <tr key={ledger._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-white">
                        {format(new Date(ledger.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="p-4 text-white">
                        {ledger.project?.title || 'Unknown Project'}
                      </td>
                      <td className="p-4 text-surface-300">
                        ${ledger.grossAmount?.toLocaleString()}
                      </td>
                      <td className="p-4 font-bold text-emerald-400">
                        ${ledger.netPayout?.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                          ledger.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {ledger.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PartnerPayouts;
