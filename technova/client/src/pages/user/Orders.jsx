import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  HiCreditCard, HiDocumentDownload, HiEye,
  HiFilter, HiClock, HiCheckCircle, HiExclamation,
  HiRefresh, HiX
} from 'react-icons/hi';
import { fetchMyOrders } from '../../redux/slices/orderSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: HiClock },
  paid: { label: 'Paid', color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: HiCheckCircle },
  in_progress: { label: 'In Progress', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: HiExclamation },
  completed: { label: 'Completed', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: HiCheckCircle },
  refunded: { label: 'Refunded', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: HiRefresh },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: HiX },
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
        toast.success('Invoice downloaded!');
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
      <div class="brand">TechNova</div>
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
      <p><strong>TechNova Technologies</strong></p>
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
    <p>Thank you for choosing TechNova! This is a computer-generated invoice.</p>
  </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const filteredOrders = filter === 'all' ? orders : orders?.filter(o => o.status === filter);

  return (
    <>
      <Helmet>
        <title>My Orders — TechNova</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Order History</h1>
          <p className="text-surface-400 text-sm mt-1">Track your payments, orders, and download invoices</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <HiFilter className="w-4 h-4 text-surface-500 flex-shrink-0" />
          {['all', 'pending', 'paid', 'in_progress', 'completed', 'refunded', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === s
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-surface-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {s === 'all' ? 'All Orders' : s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Orders */}
        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-surface-400 text-sm">Loading orders...</p>
            </div>
          ) : filteredOrders?.length === 0 ? (
            <div className="p-12 text-center">
              <HiCreditCard className="w-12 h-12 text-surface-600 mx-auto mb-3" />
              <p className="text-surface-400 font-medium">No orders found</p>
              <p className="text-surface-500 text-sm mt-1">Orders will appear here once you make a purchase.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredOrders.map((order, i) => {
                const config = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = config.icon;
                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="p-5 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Order Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-bold text-white">
                            #{order._id.slice(-6).toUpperCase()}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {config.label}
                          </span>
                        </div>
                        <p className="text-sm text-surface-300">{order.service?.title || 'Custom Service'}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-surface-500">
                          <span>{format(new Date(order.createdAt), 'MMM d, yyyy')}</span>
                          <span className="text-surface-600">•</span>
                          <span className="font-medium">{order.pricingTier} Tier</span>
                        </div>
                      </div>

                      {/* Amount & Actions */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <p className="text-lg font-display font-bold text-primary-400">
                          ₹{order.amount?.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownloadInvoice(order._id)}
                            disabled={invoiceLoading === order._id}
                            className="p-2 rounded-lg text-surface-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                            title="Download Invoice"
                          >
                            {invoiceLoading === order._id ? (
                              <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <HiDocumentDownload className="w-5 h-5" />
                            )}
                          </button>
                          {order.project && (
                            <a
                              href={`/dashboard/projects/${order.project._id || order.project}`}
                              className="p-2 rounded-lg text-surface-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
                              title="View Project"
                            >
                              <HiEye className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
