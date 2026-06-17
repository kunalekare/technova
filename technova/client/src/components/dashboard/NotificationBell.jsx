import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  HiBell, HiCheckCircle, HiFolderOpen, HiCreditCard,
  HiTicket, HiChat, HiCog, HiCheck, HiOutlineBell
} from 'react-icons/hi';
import {
  fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead
} from '../../redux/slices/notificationSlice';

const typeIcons = {
  project: HiFolderOpen,
  payment: HiCreditCard,
  ticket: HiTicket,
  message: HiChat,
  system: HiCog,
  info: HiOutlineBell,
  success: HiCheckCircle
};

const typeColors = {
  project: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  payment: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  ticket: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  message: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  system: 'text-surface-400 bg-surface-500/10 border-surface-500/20',
  info: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
};

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { items, unreadCount, loading } = useSelector((state) => state.notifications);
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const filteredItems = items.filter(item => filter === 'all' || !item.isRead);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all duration-300 ${
          isOpen ? 'bg-surface-800 text-white shadow-inner' : 'text-surface-400 hover:text-white hover:bg-surface-800/50'
        }`}
      >
        <HiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <>
            <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] flex items-center justify-center bg-primary-500 rounded-full text-[10px] font-bold text-white px-1 shadow-[0_0_10px_rgba(99,102,241,0.6)] border-2 border-surface-950 z-10">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
            <span className="absolute -top-1 -right-1 w-[20px] h-[20px] bg-primary-500 rounded-full animate-ping opacity-75"></span>
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-3 w-[22rem] sm:w-[26rem] bg-surface-900 border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 flex flex-col max-h-[85vh]"
          >
            {/* Subtle Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 opacity-50" />

            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 bg-surface-800/30 backdrop-blur-xl shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-primary-500/20 text-primary-400 text-xs font-bold">
                      {unreadCount} New
                    </span>
                  )}
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-primary-400 hover:text-white font-bold flex items-center gap-1.5 transition-colors bg-primary-500/10 hover:bg-primary-500/20 px-2.5 py-1.5 rounded-lg"
                  >
                    <HiCheck className="w-4 h-4" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-2 bg-surface-950/50 p-1 rounded-xl">
                <button 
                  onClick={() => setFilter('all')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${filter === 'all' ? 'bg-surface-800 text-white shadow-sm' : 'text-surface-400 hover:text-surface-200'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilter('unread')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${filter === 'unread' ? 'bg-surface-800 text-white shadow-sm' : 'text-surface-400 hover:text-surface-200'}`}
                >
                  Unread
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto custom-scrollbar flex-1 relative min-h-[300px]">
              {loading && items.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-surface-400 font-medium text-sm">Syncing notifications...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="w-16 h-16 bg-surface-800 rounded-full flex items-center justify-center mb-4">
                    <HiOutlineBell className="w-8 h-8 text-surface-500" />
                  </div>
                  <p className="text-white font-bold mb-1">
                    {filter === 'unread' ? 'No unread notifications' : 'You\'re all caught up!'}
                  </p>
                  <p className="text-surface-400 text-xs max-w-[200px]">
                    {filter === 'unread' ? 'You have read all your recent alerts.' : 'When you receive alerts or updates, they will appear here.'}
                  </p>
                </motion.div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredItems.slice(0, 30).map((notif) => {
                    const Icon = typeIcons[notif.type] || HiBell;
                    const colorClass = typeColors[notif.type] || 'text-surface-400 bg-surface-800 border-white/5';
                    
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        key={notif._id}
                        className={`p-4 hover:bg-surface-800/50 transition-colors cursor-pointer group relative ${
                          !notif.isRead ? 'bg-primary-900/10' : ''
                        }`}
                        onClick={() => {
                          if (!notif.isRead) handleMarkAsRead(notif._id);
                          if (notif.link) {
                            setIsOpen(false);
                            window.location.href = notif.link;
                          }
                        }}
                      >
                        {!notif.isRead && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />
                        )}
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${colorClass}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <p className={`text-sm font-bold truncate ${!notif.isRead ? 'text-white' : 'text-surface-300'}`}>
                                {notif.title}
                              </p>
                              <span className="text-[10px] font-medium text-surface-500 whitespace-nowrap shrink-0">
                                {format(new Date(notif.createdAt), 'MMM d')}
                              </span>
                            </div>
                            <p className="text-xs text-surface-400 line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/5 bg-surface-800/80 backdrop-blur-xl shrink-0">
              <Link
                to={user?.role?.name === 'admin' ? '/admin/broadcasts' : '/dashboard/notifications'}
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 bg-surface-800 hover:bg-surface-700 text-center text-sm text-white font-bold rounded-xl transition-colors block border border-white/5 shadow-sm"
              >
                {user?.role?.name === 'admin' ? 'Manage Broadcasts' : 'View Notification Settings'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
