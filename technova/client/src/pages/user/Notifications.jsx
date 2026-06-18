import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  HiOutlineBell, HiOutlineFolderOpen, HiOutlineCreditCard, HiOutlineTicket,
  HiOutlineChat, HiOutlineCog, HiCheck, HiCheckCircle
} from 'react-icons/hi';
import {
  fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead
} from '../../redux/slices/notificationSlice';

const typeIcons = {
  project: HiOutlineFolderOpen,
  payment: HiOutlineCreditCard,
  ticket: HiOutlineTicket,
  message: HiOutlineChat,
  system: HiOutlineCog,
};

const typeColors = {
  project: 'blue',
  payment: 'emerald',
  ticket: 'amber',
  message: 'purple',
  system: 'surface',
};

const Notifications = () => {
  const dispatch = useDispatch();
  const { items, unreadCount, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  return (
    <>
      <Helmet>
        <title>Notifications | Velixora</title>
      </Helmet>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header section with glow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-surface-900/50 p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 shadow-inner">
              <HiOutlineBell className="w-7 h-7 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-primary-500 border-2 border-surface-900"></span>
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">Notifications</h1>
              <p className="text-surface-400 mt-1">
                {unreadCount > 0 ? (
                  <span className="text-primary-400 font-medium">{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</span>
                ) : (
                  'You are all caught up!'
                )}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="relative z-10 px-6 py-3 bg-surface-800 hover:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all border border-white/5 hover:border-white/10 flex items-center gap-2"
            >
              <HiCheckCircle className="w-5 h-5 text-emerald-400" />
              Mark all as read
            </button>
          )}
        </div>

        <div className="space-y-4">
          {loading && items.length === 0 ? (
            <div className="glass-card p-20 text-center rounded-3xl border border-white/5">
              <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-6" />
              <p className="text-surface-400 font-medium text-lg">Fetching updates...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="glass-card p-20 text-center rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px]" />
              <div className="w-24 h-24 bg-surface-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 relative z-10 border border-white/5 rotate-3">
                <HiOutlineBell className="w-12 h-12 text-surface-500 -rotate-3" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white relative z-10">No Notifications</h3>
              <p className="text-surface-400 mt-2 max-w-sm mx-auto relative z-10">You're completely up to date. We'll notify you when something important happens.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {items.map((notif, i) => {
                  const Icon = typeIcons[notif.type] || HiOutlineBell;
                  const color = typeColors[notif.type] || 'surface';
                  
                  return (
                    <motion.div
                      key={notif._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => {
                        if (!notif.isRead) handleMarkAsRead(notif._id);
                        if (notif.link) window.location.href = notif.link;
                      }}
                      className={`relative group cursor-pointer glass-card p-4 md:p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row items-start gap-4 md:gap-5 ${
                        !notif.isRead 
                          ? 'border-primary-500/30 bg-primary-500/5 hover:bg-primary-500/10' 
                          : 'border-white/5 hover:border-white/10 hover:bg-surface-800/80'
                      }`}
                    >
                      {!notif.isRead && (
                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary-500 rounded-l-2xl shadow-[0_0_10px_rgba(var(--color-primary-500),0.8)]" />
                      )}
                      
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                        !notif.isRead 
                          ? `bg-${color}-500/20 text-${color}-400 border border-${color}-500/30 shadow-[0_0_15px_rgba(var(--color-${color}-500),0.2)]` 
                          : `bg-${color}-500/5 text-${color}-400/70 border border-${color}-500/10`
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-start justify-between gap-4">
                          <h4 className={`text-base font-bold truncate ${!notif.isRead ? 'text-white' : 'text-surface-300'}`}>
                            {notif.title}
                          </h4>
                          <span className={`text-[11px] uppercase tracking-wider font-bold shrink-0 mt-1 ${!notif.isRead ? 'text-primary-400' : 'text-surface-500'}`}>
                            {format(new Date(notif.createdAt), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className={`mt-1 text-sm leading-relaxed ${!notif.isRead ? 'text-surface-300' : 'text-surface-500'}`}>
                          {notif.message}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
