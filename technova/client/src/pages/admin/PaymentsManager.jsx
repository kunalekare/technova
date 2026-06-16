import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { HiCreditCard, HiDownload } from 'react-icons/hi';
import api from '../../services/api';
import { format } from 'date-fns';

const statusConfig = {
  pending: { label: 'Pending', class: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  paid: { label: 'Paid', class: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  refunded: { label: 'Refunded', class: 'text-red-400 bg-red-500/10 border-red-500/20' },
  cancelled: { label: 'Cancelled', class: 'text-surface-400 bg-surface-500/10 border-surface-500/20' },
};

const PaymentsManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <>
      <Helmet>
        <title>Payments & Invoices — TechNova Admin</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Payments Ledger</h1>
            <p className="text-surface-400 text-sm mt-1">Global transaction history and invoice generation.</p>
          </div>
          <button className="btn-primary">
            <HiCreditCard className="w-5 h-5 mr-1" /> Generate Invoice
          </button>
        </div>

        <div className="glass-card overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="p-12 text-center text-surface-400">Loading ledger...</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-surface-400">No transactions found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-sm font-semibold text-surface-300">Transaction / Invoice #</th>
                  <th className="p-4 text-sm font-semibold text-surface-300">Client</th>
                  <th className="p-4 text-sm font-semibold text-surface-300">Amount</th>
                  <th className="p-4 text-sm font-semibold text-surface-300">Status</th>
                  <th className="p-4 text-sm font-semibold text-surface-300">Date</th>
                  <th className="p-4 text-sm font-semibold text-surface-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-medium text-white font-mono">{order.paymentInfo?.razorpay_order_id || `INV-${order._id.substring(0, 8).toUpperCase()}`}</p>
                      <p className="text-xs text-surface-400 mt-0.5">{order.service?.title}</p>
                    </td>
                    <td className="p-4 text-sm text-surface-300">{order.user?.name || order.user?.email || 'Unknown'}</td>
                    <td className="p-4 text-sm font-medium text-white">${order.amount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-[11px] font-medium border ${statusConfig[order.status]?.class || statusConfig.pending.class}`}>
                        {statusConfig[order.status]?.label || order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-surface-400">{format(new Date(order.createdAt), 'MMM d, yyyy')}</td>
                    <td className="p-4 text-right">
                      <button className="text-primary-400 hover:text-primary-300 text-sm flex items-center justify-end gap-1 w-full">
                        <HiDownload className="w-4 h-4" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentsManager;
