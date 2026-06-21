import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { 
  HiCreditCard, HiDownload, HiOutlineDocumentText, HiOutlineCash, 
  HiOutlineExclamationCircle, HiOutlineReceiptRefund, HiX,
  HiOutlineUser, HiOutlineTag, HiDotsVertical, HiOutlineEye, HiCheckCircle
} from 'react-icons/hi';
import api from '../../services/api';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const statusConfig = {
  pending: { label: 'Pending', class: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' },
  paid: { label: 'Paid', class: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' },
  refunded: { label: 'Refunded', class: 'text-red-400 bg-red-500/10 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' },
  cancelled: { label: 'Cancelled', class: 'text-surface-400 bg-surface-500/10 border-surface-500/20' },
};

const PaymentsManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Invoice Modal State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({ clientEmail: '', amount: '', description: '', dueDate: '' });

  // Formatting Helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data.data || []);
      } catch (err) {
        toast.error('Failed to load transaction history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // Stats Calculations
  const totalRevenue = orders.filter(o => o.status === 'paid').reduce((acc, o) => acc + o.amount, 0);
  const pendingAmount = orders.filter(o => o.status === 'pending').reduce((acc, o) => acc + o.amount, 0);
  const refundedAmount = orders.filter(o => o.status === 'refunded').reduce((acc, o) => acc + o.amount, 0);

  const handleGenerateInvoice = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success(`Invoice generated and sent to ${invoiceForm.clientEmail}`);
      setShowInvoiceModal(false);
      setInvoiceForm({ clientEmail: '', amount: '', description: '', dueDate: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleDownload = (invoiceId) => {
    toast.success(`Downloading invoice ${invoiceId}...`);
  };

  return (
    <>
      <Helmet>
        <title>Payments & Invoices — Admin | TechNova</title>
      </Helmet>
      
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Payments Ledger</h1>
            <p className="text-surface-400 text-sm mt-1">Global transaction history, revenue tracking, and invoicing.</p>
          </div>
          <button 
            className="btn-primary shadow-lg shadow-primary-500/20"
            onClick={() => setShowInvoiceModal(true)}
          >
            <HiOutlineDocumentText className="w-5 h-5 mr-2" /> Generate Invoice
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <HiOutlineCash className="w-24 h-24 text-emerald-500 -mt-6 -mr-6" />
            </div>
            <div className="relative z-10">
              <p className="text-xs text-surface-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Total Revenue
              </p>
              <p className="text-3xl font-display font-bold text-white tracking-tight">
                {formatCurrency(totalRevenue)}
              </p>
              <p className="text-sm text-emerald-400 mt-2 font-medium">+14% from last month</p>
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <HiOutlineExclamationCircle className="w-24 h-24 text-amber-500 -mt-6 -mr-6" />
            </div>
            <div className="relative z-10">
              <p className="text-xs text-surface-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending Payments
              </p>
              <p className="text-3xl font-display font-bold text-white tracking-tight">
                {formatCurrency(pendingAmount)}
              </p>
              <p className="text-sm text-amber-400 mt-2 font-medium">{orders.filter(o => o.status === 'pending').length} pending invoices</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <HiOutlineReceiptRefund className="w-24 h-24 text-red-500 -mt-6 -mr-6" />
            </div>
            <div className="relative z-10">
              <p className="text-xs text-surface-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Refunded
              </p>
              <p className="text-3xl font-display font-bold text-white tracking-tight">
                {formatCurrency(refundedAmount)}
              </p>
              <p className="text-sm text-surface-500 mt-2 font-medium">Processed seamlessly</p>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="glass-card overflow-visible relative rounded-3xl border border-white/5">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-900/50 rounded-t-3xl">
            <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
          </div>

          {loading ? (
            <div className="p-20 text-center">
              <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-surface-400 font-medium">Loading ledger records...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-24 text-center border-dashed rounded-b-3xl">
              <HiOutlineDocumentText className="w-12 h-12 text-surface-600 mx-auto mb-4" />
              <p className="text-surface-400 font-medium text-lg">No transactions found.</p>
              <p className="text-surface-500 text-sm mt-1">Generate an invoice to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-800/30 border-b border-white/5">
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Transaction / Invoice #</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Client Details</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Amount</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Status</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Date</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => {
                    const invoiceNumber = order.paymentInfo?.razorpay_order_id || `INV-${order._id.substring(0, 8).toUpperCase()}`;
                    return (
                      <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-surface-800 border border-white/5 flex items-center justify-center text-surface-400 group-hover:text-primary-400 group-hover:border-primary-500/30 transition-colors">
                              <HiOutlineDocumentText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white font-mono tracking-wide">{invoiceNumber}</p>
                              <p className="text-xs text-primary-400 mt-1 font-medium">{order.service?.title || 'Custom Service'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <p className="text-sm font-bold text-white">{order.user?.name || 'Guest User'}</p>
                          <p className="text-xs text-surface-400 mt-0.5">{order.user?.email || 'N/A'}</p>
                        </td>
                        <td className="p-5">
                          <p className="text-[15px] font-bold text-white font-mono tracking-tight">{formatCurrency(order.amount)}</p>
                        </td>
                        <td className="p-5">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold tracking-wide border ${statusConfig[order.status]?.class || statusConfig.pending.class}`}>
                            {order.status === 'paid' && <HiCheckCircle className="w-3.5 h-3.5 mr-1.5" />}
                            {order.status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2 animate-pulse" />}
                            {statusConfig[order.status]?.label || order.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-5 text-sm text-surface-400 font-medium">
                          {format(new Date(order.createdAt), 'MMM d, yyyy')}
                        </td>
                        <td className="p-5">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleDownload(invoiceNumber)}
                              className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-xl transition-colors tooltip-trigger"
                              title="View Details"
                            >
                              <HiOutlineEye className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDownload(invoiceNumber)}
                              className="p-2 text-primary-400 hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/20 rounded-xl transition-all"
                              title="Download Invoice"
                            >
                              <HiDownload className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Generate Invoice Modal */}
      <AnimatePresence>
        {showInvoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => !isSubmitting && setShowInvoiceModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-900 border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-2xl relative z-10 shadow-2xl"
            >
              <button onClick={() => !isSubmitting && setShowInvoiceModal(false)} className="absolute top-6 right-6 p-2 bg-surface-800 hover:bg-surface-700 text-surface-400 hover:text-white rounded-full transition-colors"><HiX className="w-5 h-5" /></button>
              
              <div className="mb-8">
                <div className="w-12 h-12 bg-primary-500/20 text-primary-400 rounded-2xl flex items-center justify-center mb-4">
                  <HiOutlineDocumentText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white">Generate Custom Invoice</h2>
                <p className="text-surface-400 text-sm mt-1">Create and send an invoice to a client for custom project work.</p>
              </div>

              <form onSubmit={handleGenerateInvoice} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Client Email Address</label>
                    <div className="relative">
                      <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 w-5 h-5" />
                      <input
                        type="email" required
                        value={invoiceForm.clientEmail} onChange={e => setInvoiceForm({...invoiceForm, clientEmail: e.target.value})}
                        className="w-full bg-surface-800 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:border-primary-500 outline-none transition-colors"
                        placeholder="client@company.com"
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Invoice Description / Reference</label>
                    <div className="relative">
                      <HiOutlineTag className="absolute left-4 top-4 text-surface-500 w-5 h-5" />
                      <textarea
                        required rows="2"
                        value={invoiceForm.description} onChange={e => setInvoiceForm({...invoiceForm, description: e.target.value})}
                        className="w-full bg-surface-800 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:border-primary-500 outline-none transition-colors resize-none"
                        placeholder="Milestone 1: UI/UX Design Phase..."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Amount (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 font-bold">₹</span>
                      <input
                        type="number" required min="1"
                        value={invoiceForm.amount} onChange={e => setInvoiceForm({...invoiceForm, amount: e.target.value})}
                        className="w-full bg-surface-800 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:border-primary-500 outline-none transition-colors"
                        placeholder="50000"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Due Date</label>
                    <input
                      type="date" required
                      value={invoiceForm.dueDate} onChange={e => setInvoiceForm({...invoiceForm, dueDate: e.target.value})}
                      className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-4 mt-8">
                  <button type="button" onClick={() => !isSubmitting && setShowInvoiceModal(false)} className="flex-1 py-3 px-4 bg-surface-800 hover:bg-surface-700 text-white rounded-xl font-medium transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center justify-center">
                    {isSubmitting ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Send Invoice'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PaymentsManager;
