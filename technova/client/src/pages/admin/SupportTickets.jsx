import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { HiTicket, HiOutlineUserGroup, HiReply } from 'react-icons/hi';
import { format } from 'date-fns';
import api from '../../services/api'; // In real app, dispatch to a ticket admin slice

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <Helmet>
        <title>Support Tickets — TechNova Admin</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Support Tickets</h1>
            <p className="text-surface-400 text-sm mt-1">Manage client requests and assign team members.</p>
          </div>
        </div>

        <div className="glass-card overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-sm font-semibold text-surface-300">Ticket</th>
                <th className="p-4 text-sm font-semibold text-surface-300">Client</th>
                <th className="p-4 text-sm font-semibold text-surface-300">Status</th>
                <th className="p-4 text-sm font-semibold text-surface-300">Date</th>
                <th className="p-4 text-sm font-semibold text-surface-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tickets.map((t) => (
                <tr key={t._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <p className="text-sm font-medium text-white">{t.subject}</p>
                    <p className="text-xs text-surface-400">ID: {t._id}</p>
                  </td>
                  <td className="p-4 text-sm text-surface-300">{t.user?.name}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-md text-[11px] font-medium border border-white/10 bg-surface-800 text-surface-300">
                      {t.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-surface-400">{format(t.createdAt, 'MMM d, yyyy')}</td>
                  <td className="p-4 text-right">
                    <button className="text-primary-400 hover:text-primary-300 text-sm flex items-center justify-end gap-1 w-full">
                      <HiReply className="w-4 h-4" /> Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SupportTickets;
