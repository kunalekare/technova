import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  HiPlusCircle, HiX, HiPaperAirplane, HiChat,
  HiUpload, HiClock, HiCheckCircle, HiExclamation,
  HiArrowLeft, HiPaperClip, HiFilter, HiTag
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import {
  createTicket, fetchMyTickets, fetchTicketById,
  addTicketMessage, resetCreateSuccess, clearCurrentTicket
} from '../../redux/slices/ticketSlice';

const priorityColors = {
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  high: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const statusConfig = {
  open: { label: 'Open', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: HiClock },
  in_progress: { label: 'In Progress', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: HiExclamation },
  resolved: { label: 'Resolved', color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: HiCheckCircle },
  closed: { label: 'Closed', color: 'bg-surface-500/10 text-surface-400 border-surface-500/20', icon: HiCheckCircle },
};

const Tickets = () => {
  const dispatch = useDispatch();
  const { tickets, currentTicket, loading, createSuccess, error } = useSelector((state) => state.ticket);
  const { user } = useSelector((state) => state.auth);

  const [view, setView] = useState('list'); // 'list', 'create', 'detail'
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    message: '',
  });
  const [replyMessage, setReplyMessage] = useState('');
  const [replyFiles, setReplyFiles] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMyTickets());
  }, [dispatch]);

  useEffect(() => {
    if (createSuccess) {
      toast.success('Support ticket created!');
      dispatch(resetCreateSuccess());
      setView('list');
      setForm({ subject: '', category: 'general', priority: 'medium', message: '' });
    }
    if (error) toast.error(error);
  }, [createSuccess, error, dispatch]);

  useEffect(() => {
    if (view === 'detail') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentTicket?.messages, view]);

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!form.subject || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    const formData = new FormData();
    formData.append('subject', form.subject);
    formData.append('category', form.category);
    formData.append('priority', form.priority);
    formData.append('message', form.message);
    dispatch(createTicket(formData));
  };

  const handleViewTicket = (ticketId) => {
    dispatch(fetchTicketById(ticketId));
    setView('detail');
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    
    const formData = new FormData();
    formData.append('message', replyMessage);
    replyFiles.forEach(f => formData.append('attachments', f));
    
    dispatch(addTicketMessage({ id: currentTicket._id, formData }));
    setReplyMessage('');
    setReplyFiles([]);
  };

  const handleBack = () => {
    setView('list');
    dispatch(clearCurrentTicket());
  };

  const filteredTickets = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  // LIST VIEW
  if (view === 'list') {
    return (
      <>
        <Helmet><title>Support Tickets — TechNova</title></Helmet>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-white">Support Tickets</h1>
              <p className="text-surface-400 text-sm mt-1">Get help with your projects and orders</p>
            </div>
            <button onClick={() => setView('create')} className="btn-primary text-sm !px-5 !py-2.5">
              <HiPlusCircle className="w-4 h-4 mr-2" /> New Ticket
            </button>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <HiFilter className="w-4 h-4 text-surface-500 flex-shrink-0" />
            {['all', 'open', 'in_progress', 'resolved', 'closed'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  filter === s
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                    : 'text-surface-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {s === 'all' ? 'All' : statusConfig[s]?.label}
              </button>
            ))}
          </div>

          {/* Tickets List */}
          {loading && !tickets.length ? (
            <div className="glass-card p-12 text-center">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-surface-400 text-sm">Loading tickets...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <HiChat className="w-12 h-12 text-surface-600 mx-auto mb-3" />
              <p className="text-surface-400 font-medium">No tickets found</p>
              <p className="text-surface-500 text-sm mt-1">Create a new ticket to get support.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTickets.map((ticket, i) => {
                const config = statusConfig[ticket.status] || statusConfig.open;
                const StatusIcon = config.icon;
                const lastMessage = ticket.messages?.[ticket.messages.length - 1];
                return (
                  <motion.button
                    key={ticket._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleViewTicket(ticket._id)}
                    className="w-full glass-card p-5 text-left hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                            {ticket.subject}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
                            <StatusIcon className="w-3 h-3" /> {config.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColors[ticket.priority]}`}>
                            {ticket.priority.toUpperCase()}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-surface-500">
                            <HiTag className="w-3 h-3" />
                            {ticket.category}
                          </span>
                        </div>
                        {lastMessage && (
                          <p className="text-sm text-surface-400 mt-2 truncate">
                            <span className="text-surface-500">{lastMessage.sender?.name || 'You'}:</span>{' '}
                            {lastMessage.message}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-xs text-surface-500">{format(new Date(ticket.updatedAt), 'MMM d')}</span>
                        <span className="text-xs text-surface-600">{ticket.messages?.length || 0} msg</span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </>
    );
  }

  // CREATE VIEW
  if (view === 'create') {
    return (
      <>
        <Helmet><title>New Ticket — TechNova</title></Helmet>
        <div className="max-w-2xl mx-auto space-y-6">
          <button onClick={() => setView('list')} className="inline-flex items-center text-sm text-surface-400 hover:text-white transition-colors">
            <HiArrowLeft className="w-4 h-4 mr-1.5" /> Back to Tickets
          </button>

          <form onSubmit={handleCreateTicket} className="glass-card p-6 space-y-5">
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <HiPlusCircle className="w-5 h-5 text-primary-400" />
              Create Support Ticket
            </h2>

            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Subject <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="input-field"
                placeholder="Brief description of your issue"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                  <option value="general">General</option>
                  <option value="billing">Billing</option>
                  <option value="technical">Technical</option>
                  <option value="project">Project</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">Priority</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="input-field">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Message <span className="text-red-400">*</span></label>
              <textarea
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input-field resize-none"
                placeholder="Describe your issue in detail..."
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setView('list')} className="btn-secondary text-sm !px-6">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary text-sm !px-6">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : 'Submit Ticket'}
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }

  // DETAIL VIEW (Thread)
  return (
    <>
      <Helmet><title>{currentTicket?.subject || 'Ticket'} — TechNova</title></Helmet>
      <div className="max-w-3xl mx-auto space-y-6">
        <button onClick={handleBack} className="inline-flex items-center text-sm text-surface-400 hover:text-white transition-colors">
          <HiArrowLeft className="w-4 h-4 mr-1.5" /> Back to Tickets
        </button>

        {loading && !currentTicket ? (
          <div className="glass-card p-12 text-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          </div>
        ) : currentTicket ? (
          <>
            {/* Ticket Header */}
            <div className="glass-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl font-display font-bold text-white">{currentTicket.subject}</h1>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig[currentTicket.status]?.color}`}>
                      {statusConfig[currentTicket.status]?.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColors[currentTicket.priority]}`}>
                      {currentTicket.priority.toUpperCase()}
                    </span>
                    <span className="text-xs text-surface-500">
                      <HiTag className="inline w-3 h-3 mr-1" />
                      {currentTicket.category}
                    </span>
                    <span className="text-xs text-surface-500">
                      Created {format(new Date(currentTicket.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="glass-card overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h3 className="text-sm font-semibold text-surface-400">{currentTicket.messages?.length || 0} messages</h3>
              </div>
              <div className="p-6 space-y-5 max-h-[500px] overflow-y-auto">
                {currentTicket.messages?.map((msg, i) => {
                  const isMe = msg.sender?._id === user?._id;
                  return (
                    <motion.div
                      key={msg._id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold ${
                        isMe ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white' : 'bg-surface-700 text-surface-300'
                      }`}>
                        {msg.sender?.avatar ? (
                          <img src={msg.sender.avatar} alt="" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          msg.sender?.name?.charAt(0) || 'A'
                        )}
                      </div>
                      <div className={`max-w-[75%] ${isMe ? 'text-right' : ''}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold ${isMe ? 'text-primary-400' : 'text-surface-300'}`}>
                            {isMe ? 'You' : msg.sender?.name || 'Support'}
                          </span>
                          <span className="text-[10px] text-surface-500">
                            {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <div className={`rounded-2xl px-4 py-3 text-sm ${
                          isMe
                            ? 'bg-primary-600 text-white rounded-tr-sm'
                            : 'bg-surface-800 text-surface-200 rounded-tl-sm border border-white/5'
                        }`}>
                          {msg.message}
                        </div>
                        {msg.attachments?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {msg.attachments.map((att, ai) => (
                              <a key={ai} href={att} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-800/50 text-xs text-primary-400 hover:bg-surface-700/50 transition-colors">
                                <HiPaperClip className="w-3 h-3" />
                                Attachment {ai + 1}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Box */}
              {currentTicket.status !== 'closed' && (
                <div className="p-4 border-t border-white/5 bg-surface-950/50">
                  <form onSubmit={handleSendReply} className="flex items-end gap-3">
                    <div className="flex-1 relative">
                      <textarea
                        rows={2}
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="input-field resize-none !py-3 pr-12"
                        placeholder="Type your reply..."
                      />
                      <label className="absolute right-3 bottom-3 cursor-pointer text-surface-400 hover:text-primary-400 transition-colors">
                        <HiUpload className="w-5 h-5" />
                        <input type="file" multiple className="hidden" onChange={(e) => setReplyFiles(Array.from(e.target.files))} />
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={!replyMessage.trim() || loading}
                      className="btn-primary !px-4 !py-3 flex-shrink-0"
                    >
                      <HiPaperAirplane className="w-5 h-5 rotate-90" />
                    </button>
                  </form>
                  {replyFiles.length > 0 && (
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {replyFiles.map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-800/50 text-xs text-surface-300">
                          <HiPaperClip className="w-3 h-3" /> {f.name}
                          <button onClick={() => setReplyFiles(prev => prev.filter((_, fi) => fi !== i))} className="text-surface-500 hover:text-red-400">
                            <HiX className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Tickets;
