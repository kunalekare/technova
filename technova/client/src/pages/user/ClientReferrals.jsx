import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineClipboardCopy, HiGift, HiUsers } from 'react-icons/hi';
import { format } from 'date-fns';

const ClientReferrals = () => {
  const { user } = useSelector(state => state.auth);
  const [referrals, setReferrals] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const referralLink = `${window.location.origin}/register?ref=${user?._id}`;

  const fetchReferrals = async () => {
    try {
      const res = await api.get('/referrals/my');
      setReferrals(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setLoading(true);
    try {
      await api.post('/referrals', { refereeEmail: inviteEmail });
      toast.success(`Invite sent to ${inviteEmail}`);
      setInviteEmail('');
      fetchReferrals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send invite');
    } finally {
      setLoading(false);
    }
  };

  const totalEarned = referrals.reduce((sum, ref) => sum + (ref.creditAmount || 0), 0);

  return (
    <>
      <Helmet>
        <title>My Referrals | TechNova Dashboard</title>
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Refer & Earn</h1>
          <p className="text-surface-400 mt-1">Invite friends and colleagues to earn platform credits for your next project.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass-card p-8 border-primary-500/20">
            <h2 className="text-xl font-bold text-white mb-6">Invite via Email</h2>
            <form onSubmit={handleSendInvite} className="flex gap-4 mb-8">
              <div className="relative flex-1">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                <input 
                  type="email" 
                  required 
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="friend@company.com"
                  className="w-full bg-surface-800 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:border-primary-500 transition-colors"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
                {loading ? 'Sending...' : 'Send Invite'}
              </button>
            </form>

            <h2 className="text-xl font-bold text-white mb-4">Or share your personal link</h2>
            <div className="flex bg-surface-900 border border-white/10 rounded-xl overflow-hidden">
              <div className="flex-1 px-4 py-3.5 text-surface-300 text-sm font-mono truncate select-all">
                {referralLink}
              </div>
              <button 
                onClick={handleCopy}
                className="px-6 bg-surface-800 hover:bg-surface-700 text-white font-medium flex items-center gap-2 border-l border-white/10 transition-colors"
              >
                <HiOutlineClipboardCopy /> Copy
              </button>
            </div>
          </div>

          <div className="md:col-span-1 space-y-4">
            <div className="glass-card p-6 bg-primary-500/10 border-primary-500/30 text-center">
              <div className="w-12 h-12 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <HiGift className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-surface-300 uppercase tracking-wider mb-1">Total Earned</p>
              <p className="text-4xl font-bold text-white">${totalEarned}</p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-surface-800 text-surface-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <HiUsers className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-surface-300 uppercase tracking-wider mb-1">Total Invites</p>
              <p className="text-4xl font-bold text-white">{referrals.length}</p>
            </div>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 bg-surface-800/30">
            <h3 className="font-bold text-white">Referral History</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-900/50">
                <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Email Address</th>
                <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Date Sent</th>
                <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-surface-400 uppercase tracking-wider text-right">Reward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {referrals.map(ref => (
                <tr key={ref._id} className="hover:bg-white/[0.02]">
                  <td className="p-4 text-sm font-medium text-white">{ref.refereeEmail}</td>
                  <td className="p-4 text-sm text-surface-400">{format(new Date(ref.createdAt), 'MMM d, yyyy')}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                      ref.status === 'rewarded' ? 'bg-emerald-500/20 text-emerald-400' :
                      ref.status === 'signed_up' ? 'bg-primary-500/20 text-primary-400' :
                      'bg-surface-800 text-surface-400'
                    }`}>
                      {ref.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right text-sm font-bold text-emerald-400">
                    {ref.creditAmount > 0 ? `+$${ref.creditAmount}` : '-'}
                  </td>
                </tr>
              ))}
              {referrals.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-surface-400 text-sm">You haven't sent any invites yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ClientReferrals;
