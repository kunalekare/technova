import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  HiBell, HiFolderOpen, HiCreditCard, HiTicket,
  HiChat, HiCog, HiCheck
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
        <title>Notifications — TechNova</title>
      </Helmet>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Notifications</h1>
            <p className="text-surface-400 text-sm mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="btn-secondary text-xs !px-4 !py-2"
            >
              <HiCheck className="w-4 h-4 mr-1.5" />
              Mark all read
            </button>
          )}
        </div>

        <div className="glass-card overflow-hidden">
          {loading && items.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-surface-400 text-sm">Loading notifications...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center">
              <HiBell className="w-14 h-14 text-surface-600 mx-auto mb-3" />
              <p className="text-surface-400 font-medium text-lg">No notifications</p>
              <p className="text-surface-500 text-sm mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {items.map((notif, i) => {
                const Icon = typeIcons[notif.type] || HiBell;
                const colorClass = typeColors[notif.type] || 'text-surface-400 bg-white/5';
                return (
                  <motion.div
                    key={notif._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className={`px-6 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                      !notif.isRead ? 'bg-primary-500/[0.03] border-l-2 border-l-primary-500' : 'border-l-2 border-l-transparent'
                    }`}
                    onClick={() => {
                      if (!notif.isRead) handleMarkAsRead(notif._id);
                      if (notif.link) window.location.href = notif.link;
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-semibold ${!notif.isRead ? 'text-white' : 'text-surface-300'}`}>
                            {notif.title}
                          </p>
                          {!notif.isRead && (
                            <span className="w-2.5 h-2.5 rounded-full bg-primary-500 flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-surface-400 mt-0.5">{notif.message}</p>
                        <span className="text-xs text-surface-500 mt-2 block">
                          {format(new Date(notif.createdAt), 'MMMM d, yyyy · h:mm a')}
                        </span>
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

export default Notifications;
