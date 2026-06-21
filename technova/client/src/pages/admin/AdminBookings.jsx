import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import { format } from 'date-fns';
import { HiVideoCamera, HiOutlineUser } from 'react-icons/hi';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings');
        setBookings(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <>
      <Helmet>
        <title>Consultations | TechNova Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Consultations</h1>
          <p className="text-surface-400">View upcoming and past client consultations.</p>
        </div>

        {loading ? (
          <div className="text-surface-400 py-8 text-center">Loading bookings...</div>
        ) : (
          <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-surface-900/50">
                  <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Client</th>
                  <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Consultant</th>
                  <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Scheduled At</th>
                  <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider text-right">Meeting Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map(booking => (
                  <tr key={booking._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-800 flex items-center justify-center text-primary-400 overflow-hidden shrink-0">
                          {booking.client?.avatar ? <img src={booking.client.avatar} alt="" className="w-full h-full object-cover" /> : <HiOutlineUser />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{booking.client?.name}</p>
                          <p className="text-xs text-surface-400">{booking.client?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-800 flex items-center justify-center text-surface-400 overflow-hidden shrink-0">
                          {booking.teamMember?.avatar ? <img src={booking.teamMember.avatar} alt="" className="w-full h-full object-cover" /> : <HiOutlineUser />}
                        </div>
                        <p className="text-sm font-medium text-white">{booking.teamMember?.name || 'Unassigned'}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-white">
                      {format(new Date(booking.scheduledAt), 'MMM d, yyyy h:mm a')}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                        booking.status === 'scheduled' ? 'bg-primary-500/20 text-primary-400' :
                        booking.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {booking.meetingLink ? (
                        <a href={booking.meetingLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg text-sm font-medium transition-colors">
                          <HiVideoCamera /> Join Call
                        </a>
                      ) : (
                        <span className="text-surface-500 text-sm">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-surface-400 text-sm">No bookings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminBookings;
