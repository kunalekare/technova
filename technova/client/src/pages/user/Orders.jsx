import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import {
  HiCreditCard, HiOutlineDocumentDownload, HiOutlineEye,
  HiFilter, HiClock, HiCheckCircle, HiExclamation,
  HiRefresh, HiX, HiOutlineShoppingBag
} from 'react-icons/hi';
import { fetchMyOrders } from '../../redux/slices/orderSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';

const statusConfig = {
  pending: { label: 'Pending', color: 'yellow', icon: HiClock },
  paid: { label: 'Paid', color: 'green', icon: HiCheckCircle },
  in_progress: { label: 'In Progress', color: 'blue', icon: HiExclamation },
  completed: { label: 'Completed', color: 'emerald', icon: HiCheckCircle },
  refunded: { label: 'Refunded', color: 'purple', icon: HiRefresh },
  cancelled: { label: 'Cancelled', color: 'red', icon: HiX },
};

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order || { orders: [], loading: false });
  const [filter, setFilter] = useState('all');
  const [invoiceLoading, setInvoiceLoading] = useState(null);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleDownloadInvoice = async (orderId) => {
    try {
      setInvoiceLoading(orderId);
      const { data } = await api.get(`/invoices`);
      const invoice = data.data?.find(inv => inv.order?._id === orderId);
      
      if (invoice) {
        // Generate a client-side PDF-like receipt
        generateInvoicePDF(invoice);
        toast.success('Invoice generated successfully!');
      } else {
        toast.error('No invoice found for this order');
      }
    } catch {
      toast.error('Failed to download invoice');
    } finally {
      setInvoiceLoading(null);
    }
  };

  const generateInvoicePDF = (invoice) => {
    const content = `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', 'Segoe UI', sans-serif; background: #fff; color: #1a1a1a; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
    .brand { font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #6c5ce7, #00d2a0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .invoice-number { font-size: 14px; color: #666; margin-top: 4px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-paid { background: #dcfce7; color: #16a34a; }
    .badge-unpaid { background: #fef3c7; color: #d97706; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
    .info-block h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px; }
    .info-block p { font-size: 14px; color: #333; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { text-align: left; padding: 12px 16px; background: #f8f9fa; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #666; border-bottom: 2px solid #e9ecef; }
    td { padding: 14px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
    .total-row td { font-weight: 700; font-size: 16px; border-top: 2px solid #333; border-bottom: none; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #999; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Velixora</div>
      <div class="invoice-number">Invoice ${invoice.invoiceNumber}</div>
      <div style="font-size: 13px; color: #666; margin-top: 4px;">
        Date: ${format(new Date(invoice.createdAt), 'MMMM d, yyyy')}
      </div>
    </div>
    <span class="badge ${invoice.status === 'paid' ? 'badge-paid' : 'badge-unpaid'}">
      ${invoice.status?.toUpperCase()}
    </span>
  </div>
  <div class="info-grid">
    <div class="info-block">
      <h3>Billed To</h3>
      <p><strong>${invoice.order?.user?.name || 'Client'}</strong></p>
      <p>${invoice.order?.user?.email || ''}</p>
      ${invoice.order?.user?.phone ? `<p>${invoice.order.user.phone}</p>` : ''}
    </div>
    <div class="info-block" style="text-align: right;">
      <h3>From</h3>
      <p><strong>Velixora Technologies</strong></p>
      <p>support@technova.in</p>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Qty</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items?.length > 0
        ? invoice.items.map(item => `
          <tr>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td style="text-align: right;">₹${item.total?.toLocaleString()}</td>
          </tr>
        `).join('')
        : `<tr>
            <td>${invoice.order?.service?.title || 'Service'} — ${invoice.order?.project?.title || 'Project'}</td>
            <td>1</td>
            <td style="text-align: right;">₹${invoice.amount?.toLocaleString()}</td>
          </tr>`
      }
      ${invoice.tax > 0 ? `
        <tr>
          <td colspan="2" style="text-align: right; color: #666;">Tax</td>
          <td style="text-align: right;">₹${invoice.tax.toLocaleString()}</td>
        </tr>
      ` : ''}
      <tr class="total-row">
        <td colspan="2" style="text-align: right;">Total</td>
        <td style="text-align: right;">₹${(invoice.totalAmount || invoice.amount)?.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>
  ${invoice.dueDate ? `<p style="font-size: 13px; color: #666;">Due Date: ${format(new Date(invoice.dueDate), 'MMMM d, yyyy')}</p>` : ''}
  <div class="footer">
    <p>Thank you for choosing Velixora! This is a computer-generated invoice.</p>
  </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const filteredOrders = filter === 'all' ? orders : orders?.filter(o => o.status === filter);
  const filters = ['all', 'pending', 'paid', 'in_progress', 'completed', 'refunded', 'cancelled'];

  return (
    <>
      <Helmet>
        <title>Order History | Velixora</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header section with glow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-surface-900/50 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 shadow-inner">
              <HiOutlineShoppingBag className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">Order History</h1>
              <p className="text-surface-400 mt-1">Track your payments, subscriptions, and download invoices.</p>
            </div>
          </div>
        </div>

        {/* Scrolling Filter Board */}
        <div className="relative w-full">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-800 border border-white/5 shrink-0 shadow-inner">
              <HiFilter className="w-5 h-5 text-surface-400" />
            </div>
            <div className="w-px h-8 bg-white/10 mx-2 shrink-0" />
            <div className="flex bg-surface-900/50 p-1.5 rounded-2xl border border-white/5">
              {filters.map(s => {
                const isActive = filter === s;
                return (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`relative px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 z-10 ${
                      isActive ? 'text-white' : 'text-surface-400 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeOrderFilter"
                        className="absolute inset-0 bg-primary-500 rounded-xl shadow-[0_0_15px_rgba(var(--color-primary-500),0.5)] -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-20 mix-blend-plus-lighter">
                      {s === 'all' ? 'All Orders' : s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {loading ? (
            <div className="glass-card p-20 text-center rounded-3xl border border-white/5">
              <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-6" />
              <p className="text-surface-400 font-medium text-lg">Fetching your orders...</p>
            </div>
          ) : filteredOrders?.length === 0 ? (
            <div className="glass-card p-20 text-center rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px]" />
              <div className="w-24 h-24 bg-surface-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 relative z-10 border border-white/5 rotate-3">
                <HiCreditCard className="w-12 h-12 text-surface-500 -rotate-3" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white relative z-10">No Orders Found</h3>
              <p className="text-surface-400 mt-2 max-w-sm mx-auto relative z-10">You haven't made any purchases yet. When you do, your history and invoices will appear here.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredOrders.map((order, i) => {
                const config = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = config.icon;
                const colorCode = config.color;

                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-surface-800/80 transition-all duration-300 group flex flex-col md:flex-row items-center gap-6"
                  >
                    {/* Status Badge Icon */}
                    <div className={`w-14 h-14 rounded-2xl bg-${colorCode}-500/10 flex items-center justify-center border border-${colorCode}-500/20 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(var(--color-${colorCode}-500),0.1)] group-hover:shadow-[0_0_20px_rgba(var(--color-${colorCode}-500),0.3)]`}>
                      <StatusIcon className={`w-7 h-7 text-${colorCode}-400`} />
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 min-w-0 w-full text-center md:text-left">
                      <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white truncate w-full md:w-auto">
                          {order.service?.title || 'Custom Project Service'}
                        </h3>
                        <span className={`px-3 py-1 text-[10px] font-black tracking-widest rounded-lg border uppercase bg-${colorCode}-500/10 text-${colorCode}-400 border-${colorCode}-500/20 shrink-0`}>
                          {config.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-surface-400 font-medium">
                        <span className="flex items-center gap-1">Order #{order._id.slice(-8).toUpperCase()}</span>
                        <span className="hidden md:inline text-surface-600">•</span>
                        <span>{format(new Date(order.createdAt), 'MMMM d, yyyy')}</span>
                        <span className="hidden md:inline text-surface-600">•</span>
                        <span className="text-primary-400 font-bold">{order.pricingTier} Tier</span>
                      </div>
                    </div>

                    {/* Amount & Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0 w-full md:w-auto mt-4 md:mt-0 justify-between md:justify-end">
                      <div className="text-center md:text-right">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-surface-500 mb-0.5 block">Total Amount</span>
                        <p className="text-2xl font-display font-bold text-white group-hover:text-primary-300 transition-colors">
                          ₹{order.amount?.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 h-full">
                        {order.project && (
                          <Link
                            to={`/dashboard/projects/${order.project._id || order.project}`}
                            className="w-12 h-12 rounded-xl bg-surface-800 border border-white/5 text-surface-400 flex items-center justify-center hover:bg-primary-500/10 hover:text-primary-400 hover:border-primary-500/30 transition-all duration-300 shadow-lg group/btn"
                            title="View Associated Project"
                          >
                            <HiOutlineEye className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                          </Link>
                        )}
                        <button
                          onClick={() => handleDownloadInvoice(order._id)}
                          disabled={invoiceLoading === order._id}
                          className="px-6 h-12 bg-surface-800 border border-white/5 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-300 shadow-lg group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {invoiceLoading === order._id ? (
                            <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <HiOutlineDocumentDownload className="w-5 h-5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          )}
                          Invoice
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
