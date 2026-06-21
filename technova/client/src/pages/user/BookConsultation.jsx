import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiCalendar, HiClock, HiUserGroup, HiOutlineVideoCamera } from 'react-icons/hi';
import { format, addDays, startOfToday } from 'date-fns';

const BookConsultation = () => {
  const [team, setTeam] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(addDays(startOfToday(), 1), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

  const fetchMyBookings = async () => {
    try {
      const res = await api.get('/bookings/my');
      setMyBookings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const [fetchingTeam, setFetchingTeam] = useState(true);

  useEffect(() => {
    // Fetch staff/admins that can be booked
    api.get('/team')
      .then(res => setTeam(res.data.data))
      .catch(() => {})
      .finally(() => setFetchingTeam(false));
      
    fetchMyBookings();
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedMember) return toast.error('Please select a team member');

    setLoading(true);
    try {
      // Parse date and time into ISO string
      const dateStr = `${selectedDate} ${selectedTime}`;
      const scheduledAt = new Date(dateStr).toISOString();

      await api.post('/bookings', {
        teamMember: selectedMember,
        scheduledAt,
        notes
      });

      toast.success('Consultation booked successfully!');
      setSelectedMember('');
      setNotes('');
      fetchMyBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book consultation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Book a Consultation | TechNova Dashboard</title>
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Book Consultation</h1>
          <p className="text-surface-400 mt-1">Schedule a video call with our experts to discuss your projects or new ideas.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-card p-6 border-primary-500/20">
            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Select Expert</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {team.map(member => (
                    <div 
                      key={member._id}
                      onClick={() => setSelectedMember(member.user?._id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedMember === member.user?._id 
                          ? 'bg-primary-500/10 border-primary-500 shadow-glow-primary' 
                          : 'bg-surface-800 border-white/5 hover:bg-surface-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {member.user?.avatar ? (
                          <img src={member.user.avatar} alt={member.user.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-surface-600 flex items-center justify-center font-bold text-white">
                            {member.user?.name?.charAt(0) || '?'}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white text-sm">{member.user?.name || 'Expert'}</p>
                          <p className="text-xs text-surface-400">{member.designation || 'Consultant'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {fetchingTeam ? (
                    <div className="text-surface-400 text-sm">Loading experts...</div>
                  ) : team.length === 0 ? (
                    <div className="text-surface-400 text-sm">No experts available to book at this time.</div>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2"><HiCalendar className="inline mr-1" /> Select Date</label>
                  <input 
                    type="date" 
                    required 
                    min={format(addDays(startOfToday(), 1), 'yyyy-MM-dd')}
                    value={selectedDate} 
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2"><HiClock className="inline mr-1" /> Select Time</label>
                  <select 
                    value={selectedTime} 
                    onChange={e => setSelectedTime(e.target.value)}
                    className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 transition-colors"
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Meeting Notes / Agenda</label>
                <textarea 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)}
                  placeholder="What would you like to discuss?"
                  className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 transition-colors resize-none"
                  rows="3"
                ></textarea>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg">
                {loading ? 'Scheduling...' : 'Confirm Booking'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 border-white/5">
              <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                <HiOutlineVideoCamera className="text-primary-500" /> How it works
              </h3>
              <ul className="space-y-4 text-sm text-surface-300">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-surface-800 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">1</span>
                  <span>Select an expert and an available time slot.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-surface-800 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">2</span>
                  <span>You'll instantly receive a Google Meet video link.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-surface-800 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">3</span>
                  <span>Join the call at the scheduled time to discuss your needs.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* My Upcoming Bookings Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Your Upcoming Consultations</h2>
          {loadingBookings ? (
            <div className="text-surface-400 text-sm">Loading your bookings...</div>
          ) : myBookings.length === 0 ? (
            <div className="glass-card p-8 text-center border-white/5">
              <HiOutlineVideoCamera className="w-12 h-12 text-surface-600 mx-auto mb-3" />
              <p className="text-surface-400">You don't have any upcoming consultations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBookings.map(booking => (
                <div key={booking._id} className="glass-card p-6 border-white/5 hover:border-primary-500/30 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-700 flex items-center justify-center overflow-hidden">
                        {booking.teamMember?.avatar ? (
                          <img src={booking.teamMember.avatar} alt="Expert" className="w-full h-full object-cover" />
                        ) : (
                          <HiUserGroup className="text-surface-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{booking.teamMember?.name || 'Expert'}</p>
                        <p className="text-xs text-surface-400">Consultant</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      booking.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-primary-500/20 text-primary-400'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <p className="text-sm flex items-center gap-2 text-surface-300">
                      <HiCalendar className="text-primary-500" /> 
                      {format(new Date(booking.scheduledAt), 'MMMM d, yyyy')}
                    </p>
                    <p className="text-sm flex items-center gap-2 text-surface-300">
                      <HiClock className="text-primary-500" /> 
                      {format(new Date(booking.scheduledAt), 'h:mm a')}
                    </p>
                  </div>

                  <a 
                    href={booking.meetingLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full py-2 flex items-center justify-center gap-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl text-sm font-medium transition-colors"
                  >
                    <HiOutlineVideoCamera className="w-5 h-5" />
                    Join Video Call
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookConsultation;
