import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  HiPlusCircle, HiX, HiPaperAirplane, HiOutlineChat,
  HiUpload, HiClock, HiCheckCircle, HiExclamation,
  HiArrowLeft, HiPaperClip, HiFilter, HiTag, HiOutlineSupport
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import {
  createTicket, fetchMyTickets, fetchTicketById,
  addTicketMessage, resetCreateSuccess, clearCurrentTicket
} from '../../redux/slices/ticketSlice';

const priorityColors = {
  low: 'blue',
  medium: 'yellow',
  high: 'red',
};

const statusConfig = {
  open: { label: 'Open', color: 'yellow', icon: HiClock },
  in_progress: { label: 'In Progress', color: 'blue', icon: HiExclamation },
  resolved: { label: 'Resolved', color: 'emerald', icon: HiCheckCircle },
  closed: { label: 'Closed', color: 'surface', icon: HiCheckCircle },
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
    if (view === 'list') {
      dispatch(fetchMyTickets());
    }
  }, [dispatch, view]);

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
  const filters = ['all', 'open', 'in_progress', 'resolved', 'closed'];

  // LIST VIEW
  if (view === 'list') {
    return (
      <>
        <Helmet><title>Support Tickets | TechNova</title></Helmet>
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header section with glow */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-surface-900/50 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 shadow-inner">
                <HiOutlineSupport className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-white tracking-tight">Support Tickets</h1>
                <p className="text-surface-400 mt-1">Get immediate help with your projects and orders.</p>
              </div>
            </div>
            <button 
              onClick={() => setView('create')} 
              className="relative z-10 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(var(--color-primary-500),0.3)] hover:shadow-[0_0_25px_rgba(var(--color-primary-500),0.5)] flex items-center gap-2 group"
            >
              <HiPlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              New Ticket
            </button>
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
                          layoutId="activeTicketFilter"
                          className="absolute inset-0 bg-primary-500 rounded-xl shadow-[0_0_15px_rgba(var(--color-primary-500),0.5)] -z-10"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-20 mix-blend-plus-lighter">
                        {s === 'all' ? 'All Tickets' : statusConfig[s]?.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-4">
            {loading && !tickets.length ? (
              <div className="glass-card p-20 text-center rounded-3xl border border-white/5">
                <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-6" />
                <p className="text-surface-400 font-medium text-lg">Fetching your tickets...</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="glass-card p-20 text-center rounded-3xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px]" />
                <div className="w-24 h-24 bg-surface-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 relative z-10 border border-white/5 rotate-3">
                  <HiOutlineChat className="w-12 h-12 text-surface-500 -rotate-3" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white relative z-10">No Tickets Found</h3>
                <p className="text-surface-400 mt-2 max-w-sm mx-auto relative z-10">You don't have any support tickets in this category. Need help? Create a new ticket.</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredTickets.map((ticket, i) => {
                  const config = statusConfig[ticket.status] || statusConfig.open;
                  const StatusIcon = config.icon;
                  const colorCode = config.color;
                  const prioColor = priorityColors[ticket.priority];
                  const lastMessage = ticket.messages?.[ticket.messages.length - 1];

                  return (
                    <motion.div
                      key={ticket._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleViewTicket(ticket._id)}
                      className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-surface-800/80 transition-all duration-300 group cursor-pointer flex flex-col md:flex-row items-start md:items-center gap-6"
                    >
                      {/* Status Icon */}
                      <div className={`w-14 h-14 rounded-2xl bg-${colorCode}-500/10 flex items-center justify-center border border-${colorCode}-500/20 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(var(--color-${colorCode}-500),0.1)] group-hover:shadow-[0_0_20px_rgba(var(--color-${colorCode}-500),0.3)]`}>
                        <StatusIcon className={`w-7 h-7 text-${colorCode}-400`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors truncate">
                            {ticket.subject}
                          </h3>
                          <div className="flex gap-2 shrink-0">
                            <span className={`px-3 py-1 text-[10px] font-black tracking-widest rounded-lg border uppercase bg-${colorCode}-500/10 text-${colorCode}-400 border-${colorCode}-500/20`}>
                              {config.label}
                            </span>
                            <span className={`px-3 py-1 text-[10px] font-black tracking-widest rounded-lg border uppercase bg-${prioColor}-500/10 text-${prioColor}-400 border-${prioColor}-500/20`}>
                              {ticket.priority} Priority
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-surface-400 font-medium">
                          <span className="flex items-center gap-1.5"><HiTag className="w-4 h-4 text-surface-500" />{ticket.category.replace(/\b\w/g, l => l.toUpperCase())}</span>
                          <span className="hidden md:inline text-surface-600">•</span>
                          <span>{format(new Date(ticket.updatedAt), 'MMMM d, yyyy')}</span>
                          <span className="hidden md:inline text-surface-600">•</span>
                          <span className="text-primary-400/80 font-bold">{ticket.messages?.length || 0} Messages</span>
                        </div>
                        {lastMessage && (
                          <div className="mt-4 p-3 rounded-xl bg-surface-900/50 border border-white/5 truncate flex items-center gap-2">
                            <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">{lastMessage.sender?.name === user?.name ? 'You' : lastMessage.sender?.name || 'Support'}:</span>
                            <span className="text-sm text-surface-300 truncate">{lastMessage.message}</span>
                          </div>
                        )}
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
  }

  // CREATE VIEW
  if (view === 'create') {
    return (
      <>
        <Helmet><title>New Ticket | TechNova</title></Helmet>
        <div className="max-w-3xl mx-auto space-y-6">
          <button onClick={() => setView('list')} className="inline-flex items-center text-sm font-bold text-surface-400 hover:text-white transition-colors group">
            <HiArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" /> Back to Tickets
          </button>

          <form onSubmit={handleCreateTicket} className="glass-card p-8 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
            
            <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center border border-primary-500/30">
                <HiOutlineSupport className="w-5 h-5 text-primary-400" />
              </div>
              Create Support Ticket
            </h2>

            <div className="space-y-6 relative z-10">
              <div>
                <label className="block text-xs font-bold text-surface-500 mb-2 uppercase tracking-wider">
                  Subject <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-surface-500 mb-2 uppercase tracking-wider">Category</label>
                  <select 
                    value={form.category} 
                    onChange={(e) => setForm({ ...form, category: e.target.value })} 
                    className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="technical">Technical Support</option>
                    <option value="project">Project Assistance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-surface-500 mb-2 uppercase tracking-wider">Priority</label>
                  <select 
                    value={form.priority} 
                    onChange={(e) => setForm({ ...form, priority: e.target.value })} 
                    className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                  >
                    <option value="low">Low - General Questions</option>
                    <option value="medium">Medium - Needs Attention</option>
                    <option value="high">High - Urgent Issue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-500 mb-2 uppercase tracking-wider">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-surface-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
                  placeholder="Describe your issue in detail so our team can help you faster..."
                  required
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setView('list')} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors border border-white/5">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(var(--color-primary-500),0.3)] hover:shadow-[0_0_25px_rgba(var(--color-primary-500),0.5)]">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : 'Submit Ticket'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  }

  // DETAIL VIEW (Thread)
  return (
    <>
      <Helmet><title>{currentTicket?.subject || 'Ticket'} | TechNova</title></Helmet>
      <div className="max-w-4xl mx-auto space-y-6">
        <button onClick={handleBack} className="inline-flex items-center text-sm font-bold text-surface-400 hover:text-white transition-colors group">
          <HiArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" /> Back to Tickets
        </button>

        {loading && !currentTicket ? (
          <div className="glass-card p-20 text-center rounded-3xl">
            <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-6" />
          </div>
        ) : currentTicket ? (
          <>
            {/* Ticket Header */}
            <div className="glass-card p-8 rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px]" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-2xl font-display font-bold text-white mb-3">{currentTicket.subject}</h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 text-[10px] font-black tracking-widest rounded-lg border uppercase bg-${statusConfig[currentTicket.status]?.color}-500/10 text-${statusConfig[currentTicket.status]?.color}-400 border-${statusConfig[currentTicket.status]?.color}-500/20`}>
                      {statusConfig[currentTicket.status]?.label}
                    </span>
                    <span className={`px-3 py-1 text-[10px] font-black tracking-widest rounded-lg border uppercase bg-${priorityColors[currentTicket.priority]}-500/10 text-${priorityColors[currentTicket.priority]}-400 border-${priorityColors[currentTicket.priority]}-500/20`}>
                      {currentTicket.priority} Priority
                    </span>
                    <span className="text-sm font-bold text-surface-500 flex items-center gap-1.5">
                      <HiTag className="w-4 h-4" />
                      {currentTicket.category.replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>
                <div className="text-left md:text-right shrink-0">
                  <p className="text-xs uppercase tracking-wider font-bold text-surface-500">Created On</p>
                  <p className="text-base font-bold text-white mt-1">{format(new Date(currentTicket.createdAt), 'MMMM d, yyyy')}</p>
                  <p className="text-sm text-surface-400">{format(new Date(currentTicket.createdAt), 'h:mm a')}</p>
                </div>
              </div>
            </div>

            {/* Messages Thread container */}
            <div className="glass-card rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-white/5 bg-surface-900/50 backdrop-blur-md flex items-center gap-3">
                <HiOutlineChat className="w-5 h-5 text-primary-400" />
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">Support Thread</h3>
                <span className="px-2 py-0.5 rounded-full bg-surface-800 text-xs font-bold text-surface-400 border border-white/5">
                  {currentTicket.messages?.length || 0} messages
                </span>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface-950/30">
                {currentTicket.messages?.map((msg, i) => {
                  const isMe = msg.sender?._id === user?._id;
                  return (
                    <motion.div
                      key={msg._id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-base font-bold border ${
                        isMe 
                          ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white border-primary-500/30 shadow-[0_0_15px_rgba(var(--color-primary-500),0.3)]' 
                          : 'bg-surface-800 text-surface-300 border-white/10'
                      }`}>
                        {msg.sender?.avatar ? (
                          <img src={msg.sender.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          msg.sender?.name?.charAt(0).toUpperCase() || 'S'
                        )}
                      </div>
                      
                      <div className={`max-w-[80%] ${isMe ? 'text-right' : ''}`}>
                        <div className={`flex items-baseline gap-2 mb-1.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                          <span className={`text-sm font-bold ${isMe ? 'text-white' : 'text-white'}`}>
                            {isMe ? 'You' : msg.sender?.name || 'Support Team'}
                          </span>
                          <span className="text-xs font-medium text-surface-500">
                            {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        
                        <div className={`inline-block text-left px-5 py-3.5 text-sm leading-relaxed ${
                          isMe
                            ? 'bg-primary-500 text-white rounded-2xl rounded-tr-sm shadow-md'
                            : 'bg-surface-800 text-surface-200 rounded-2xl rounded-tl-sm border border-white/5'
                        }`}>
                          {msg.message}
                        </div>
                        
                        {msg.attachments?.length > 0 && (
                          <div className={`mt-2 flex flex-wrap gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {msg.attachments.map((att, ai) => (
                              <a key={ai} href={att} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-800 border border-white/5 text-xs font-medium text-primary-400 hover:bg-surface-700 hover:text-primary-300 transition-colors">
                                <HiPaperClip className="w-3.5 h-3.5" />
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
              {currentTicket.status !== 'closed' ? (
                <div className="p-4 border-t border-white/5 bg-surface-900/50 backdrop-blur-md">
                  <form onSubmit={handleSendReply} className="flex items-end gap-3">
                    <div className="flex-1 relative">
                      <textarea
                        rows={1}
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="w-full bg-surface-800 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none min-h-[60px] pr-14 shadow-inner"
                        placeholder="Type your reply here..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendReply(e);
                          }
                        }}
                      />
                      <label className="absolute right-4 bottom-4 cursor-pointer w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center text-surface-300 hover:text-primary-400 hover:bg-primary-500/10 transition-colors">
                        <HiUpload className="w-4 h-4" />
                        <input type="file" multiple className="hidden" onChange={(e) => setReplyFiles(Array.from(e.target.files))} />
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={!replyMessage.trim() || loading}
                      className="h-[60px] w-[60px] rounded-2xl bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <HiPaperAirplane className="w-6 h-6 rotate-90 group-hover:scale-110 transition-transform" />
                      )}
                    </button>
                  </form>
                  {replyFiles.length > 0 && (
                    <div className="flex items-center gap-2 mt-3 px-1 flex-wrap">
                      {replyFiles.map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-800 border border-white/5 text-xs font-medium text-surface-300">
                          <HiPaperClip className="w-3.5 h-3.5 text-primary-400" /> 
                          <span className="truncate max-w-[150px]">{f.name}</span>
                          <button type="button" onClick={() => setReplyFiles(prev => prev.filter((_, fi) => fi !== i))} className="ml-1 text-surface-500 hover:text-red-400 transition-colors">
                            <HiX className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 bg-surface-900 border-t border-white/5 text-center">
                  <p className="text-surface-400 font-medium">This ticket is closed. You can no longer reply to this thread.</p>
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
