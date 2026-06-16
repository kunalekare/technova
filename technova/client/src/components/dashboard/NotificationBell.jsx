import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  HiBell, HiCheckCircle, HiFolderOpen, HiCreditCard,
  HiTicket, HiChat, HiCog, HiCheck
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
};

const typeColors = {
  project: 'text-blue-400 bg-blue-500/10',
  payment: 'text-emerald-400 bg-emerald-500/10',
  ticket: 'text-amber-400 bg-amber-500/10',
  message: 'text-purple-400 bg-purple-500/10',
  system: 'text-surface-400 bg-surface-500/10',
};

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { items, unreadCount, loading } = useSelector((state) => state.notifications);
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-surface-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
      >
        <HiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 rounded-full text-[10px] font-bold text-white px-1 border-2 border-surface-950">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-96 max-h-[480px] bg-surface-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-surface-900/95 backdrop-blur-xl sticky top-0 z-10">
              <h3 className="text-sm font-semibold text-white">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-xs font-medium text-primary-400">({unreadCount} new)</span>
                )}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 transition-colors"
                >
                  <HiCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[360px]">
              {loading && items.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-surface-500 text-xs">Loading...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="p-8 text-center">
                  <HiBell className="w-8 h-8 text-surface-600 mx-auto mb-2" />
                  <p className="text-surface-400 text-sm font-medium">No notifications yet</p>
                  <p className="text-surface-500 text-xs mt-1">You're all caught up!</p>
                </div>
              ) : (
                items.slice(0, 20).map((notif) => {
                  const Icon = typeIcons[notif.type] || HiBell;
                  const colorClass = typeColors[notif.type] || 'text-surface-400 bg-white/5';
                  return (
                    <div
                      key={notif._id}
                      className={`px-5 py-3.5 hover:bg-white/[0.03] transition-colors border-b border-white/[0.03] cursor-pointer ${
                        !notif.isRead ? 'bg-primary-500/[0.03]' : ''
                      }`}
                      onClick={() => {
                        if (!notif.isRead) handleMarkAsRead(notif._id);
                        if (notif.link) {
                          setIsOpen(false);
                          window.location.href = notif.link;
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-medium truncate ${!notif.isRead ? 'text-white' : 'text-surface-300'}`}>
                              {notif.title}
                            </p>
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-surface-400 mt-0.5 line-clamp-2">{notif.message}</p>
                          <span className="text-[10px] text-surface-500 mt-1 block">
                            {format(new Date(notif.createdAt), 'MMM d, h:mm a')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-3 border-t border-white/5 bg-surface-900/95 backdrop-blur-xl">
                <Link
                  to="/dashboard/notifications"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors block"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
