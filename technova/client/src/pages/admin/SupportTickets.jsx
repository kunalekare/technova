import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { 
  HiTicket, HiOutlineUserGroup, HiReply, HiOutlineCheckCircle, 
  HiOutlineExclamationCircle, HiOutlineClock, HiOutlineChatAlt2, HiX 
} from 'react-icons/hi';
import { format } from 'date-fns';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const statusConfig = {
  open: { label: 'Open', class: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' },
  in_progress: { label: 'In Progress', class: 'text-primary-400 bg-primary-500/10 border-primary-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]' },
  resolved: { label: 'Resolved', class: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  closed: { label: 'Closed', class: 'text-surface-400 bg-surface-500/10 border-surface-500/20' },
};

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Reply Modal State
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('/tickets/all');
        setTickets(data.data || []);
      } catch (err) {
        console.error('Failed to fetch admin tickets:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleReplySubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Reply sent successfully!');
      setSelectedTicket(null);
      setReplyText('');
      setIsSubmitting(false);
    }, 1200);
  };

  // Stats
  const openCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;

  return (
    <>
      <Helmet>
        <title>Support Desk — Admin | TechNova</title>
      </Helmet>
      
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Support Desk</h1>
            <p className="text-surface-400 text-sm mt-1">Manage client support requests and communications.</p>
          </div>
          <button className="btn-primary shadow-lg shadow-primary-500/20 flex items-center">
            <HiOutlineChatAlt2 className="w-5 h-5 mr-2" /> New Internal Ticket
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <HiTicket className="w-24 h-24 text-white -mt-6 -mr-6" />
            </div>
            <div className="relative z-10">
              <p className="text-xs text-surface-400 font-bold uppercase tracking-wider mb-1">Total Tickets</p>
              <p className="text-4xl font-display font-bold text-white">{tickets.length}</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <HiOutlineExclamationCircle className="w-24 h-24 text-amber-500 -mt-6 -mr-6" />
            </div>
            <div className="relative z-10">
              <p className="text-xs text-surface-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Action Required
              </p>
              <p className="text-4xl font-display font-bold text-amber-400">{openCount}</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <HiOutlineCheckCircle className="w-24 h-24 text-emerald-500 -mt-6 -mr-6" />
            </div>
            <div className="relative z-10">
              <p className="text-xs text-surface-400 font-bold uppercase tracking-wider mb-1">Resolved</p>
              <p className="text-4xl font-display font-bold text-emerald-400">{resolvedCount}</p>
            </div>
          </div>
        </div>

        {/* Tickets Table / Empty State */}
        <div className="glass-card overflow-visible relative rounded-3xl border border-white/5">
          <div className="p-6 border-b border-white/5 bg-surface-900/50 rounded-t-3xl flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Active Queue</h2>
          </div>
          
          {loading ? (
            <div className="p-20 text-center">
              <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-surface-400 font-medium">Loading support queue...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="py-24 text-center border-dashed rounded-b-3xl">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl" />
                <HiOutlineCheckCircle className="w-10 h-10 text-emerald-400 relative z-10" />
              </div>
              <p className="text-xl font-bold text-white mb-2">Inbox Zero</p>
              <p className="text-surface-400 max-w-sm mx-auto">All client requests have been handled. Great job keeping the queue clear!</p>
            </div>
          ) : (
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-800/30 border-b border-white/5">
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Ticket Info</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Client</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Status</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Date</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tickets.map((t) => (
                    <tr key={t._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-surface-800 border border-white/5 flex items-center justify-center flex-shrink-0 text-surface-500 group-hover:text-primary-400 transition-colors">
                            <HiTicket className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">{t.subject}</p>
                            <p className="text-[11px] font-mono text-surface-500 mt-1 uppercase tracking-widest">TK-{t._id.substring(0, 6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-surface-700 to-surface-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                            {t.user?.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{t.user?.name || 'Anonymous'}</p>
                            <p className="text-[11px] text-surface-400 mt-0.5">{t.user?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide border ${statusConfig[t.status]?.class || statusConfig.open.class}`}>
                          {statusConfig[t.status]?.label || t.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-5">
                        <p className="text-sm text-surface-300 font-medium flex items-center gap-2">
                          <HiOutlineClock className="w-4 h-4 text-surface-500" />
                          {format(new Date(t.createdAt), 'MMM d, yyyy')}
                        </p>
                      </td>
                      <td className="p-5">
                        <div className="flex justify-end">
                          <button 
                            onClick={() => setSelectedTicket(t)}
                            className="flex items-center gap-2 px-4 py-2 text-primary-400 hover:text-white bg-primary-500/10 hover:bg-primary-500 rounded-xl font-medium transition-all shadow-sm hover:shadow-primary-500/20"
                          >
                            <HiReply className="w-4 h-4" /> Reply
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => !isSubmitting && setSelectedTicket(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-900 border border-white/10 rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-white/5 bg-surface-800/30 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-500/20 text-primary-400 rounded-xl flex items-center justify-center">
                    <HiReply className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Reply to Ticket</h3>
                    <p className="text-xs text-surface-400 font-mono tracking-widest uppercase mt-0.5">TK-{selectedTicket._id.substring(0, 6)}</p>
                  </div>
                </div>
                <button onClick={() => !isSubmitting && setSelectedTicket(null)} className="p-2 bg-surface-800 hover:bg-surface-700 text-surface-400 hover:text-white rounded-full transition-colors"><HiX className="w-5 h-5" /></button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                
                {/* Client Message Context */}
                <div className="bg-surface-800/50 border border-white/5 rounded-2xl p-5 relative">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center text-[10px] font-bold text-white">
                        {selectedTicket.user?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{selectedTicket.user?.name || 'Client'}</p>
                        <p className="text-xs text-surface-500">{format(new Date(selectedTicket.createdAt), 'MMM d, h:mm a')}</p>
                      </div>
                    </div>
                  </div>
                  <h4 className="font-medium text-white mb-2">{selectedTicket.subject}</h4>
                  <p className="text-sm text-surface-300 leading-relaxed bg-surface-900/50 p-4 rounded-xl border border-white/5">
                    {selectedTicket.description || 'No description provided.'}
                  </p>
                </div>

                {/* Reply Form */}
                <form id="replyForm" onSubmit={handleReplySubmit}>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Your Response</label>
                  <textarea
                    required rows="5"
                    value={replyText} onChange={e => setReplyText(e.target.value)}
                    className="w-full bg-surface-800 border border-white/10 rounded-xl p-4 text-white focus:border-primary-500 outline-none transition-colors resize-none text-sm leading-relaxed"
                    placeholder={`Hi ${selectedTicket.user?.name?.split(' ')[0] || 'there'},\n\nThanks for reaching out...`}
                  />
                  
                  <div className="mt-4 flex items-center gap-3">
                    <label className="text-sm text-surface-400 flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded bg-surface-800 border-white/10 text-primary-500 focus:ring-primary-500" />
                      Mark ticket as resolved
                    </label>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-6 pt-0 shrink-0">
                <div className="pt-5 border-t border-white/5 flex gap-4">
                  <button type="button" onClick={() => !isSubmitting && setSelectedTicket(null)} className="flex-1 py-3 px-4 bg-surface-800 hover:bg-surface-700 text-white rounded-xl font-medium transition-colors">Cancel</button>
                  <button type="submit" form="replyForm" disabled={isSubmitting || !replyText.trim()} className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center justify-center">
                    {isSubmitting ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Send Reply'}
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportTickets;
