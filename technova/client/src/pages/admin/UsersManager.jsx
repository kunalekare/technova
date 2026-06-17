import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, updateUserRole } from '../../redux/slices/adminSlice';
import { format } from 'date-fns';
import { 
  HiDotsVertical, HiCheckCircle, HiBan, HiOutlineUserAdd, 
  HiOutlineKey, HiOutlineTrash, HiX, HiOutlineMail, HiOutlineUser,
  HiOutlineShieldCheck
} from 'react-icons/hi';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';

const UsersManager = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin || { users: [], loading: false });
  const [openMenuId, setOpenMenuId] = useState(null);
  
  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'client' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleToggleStatus = async (user) => {
    try {
      const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
      await dispatch(updateUserRole({ userId: user._id, updateData: { status: newStatus } })).unwrap();
      toast.success(`${user.name}'s account has been ${newStatus === 'active' ? 'activated' : 'suspended'}`);
    } catch (err) {
      toast.error(err || 'Failed to update user status');
    }
    setOpenMenuId(null);
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call for invitation
    setTimeout(() => {
      toast.success(`Invitation email sent to ${inviteForm.email}`);
      setShowInviteModal(false);
      setInviteForm({ name: '', email: '', role: 'client' });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleMockAction = (actionName) => {
    toast.success(`${actionName} action triggered successfully`);
    setOpenMenuId(null);
  };

  return (
    <>
      <Helmet>
        <title>User Management — Admin | TechNova</title>
      </Helmet>

      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">User Management</h1>
            <p className="text-surface-400 text-sm mt-1">Manage client accounts, team access, and permissions.</p>
          </div>
          <button 
            className="btn-primary shadow-lg shadow-primary-500/20" 
            onClick={() => setShowInviteModal(true)}
          >
            <HiOutlineUserAdd className="w-5 h-5 mr-2" /> Invite User
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary-500" />
            <p className="text-surface-400 text-xs font-bold uppercase tracking-wider mb-1">Total Users</p>
            <p className="text-3xl font-bold text-white">{users.length}</p>
          </div>
          <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <p className="text-surface-400 text-xs font-bold uppercase tracking-wider mb-1">Active</p>
            <p className="text-3xl font-bold text-white">{users.filter(u => u.status !== 'suspended').length}</p>
          </div>
          <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            <p className="text-surface-400 text-xs font-bold uppercase tracking-wider mb-1">Team Members</p>
            <p className="text-3xl font-bold text-white">{users.filter(u => u.role?.name === 'admin' || u.role?.name === 'staff').length}</p>
          </div>
          <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
            <p className="text-surface-400 text-xs font-bold uppercase tracking-wider mb-1">Suspended</p>
            <p className="text-3xl font-bold text-white">{users.filter(u => u.status === 'suspended').length}</p>
          </div>
        </div>

        <div className="glass-card overflow-visible relative rounded-3xl border border-white/5">
          {loading ? (
            <div className="p-20 text-center">
              <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-surface-400 font-medium">Loading user database...</p>
            </div>
          ) : (
            <div className="overflow-x-auto min-h-[500px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-800/50 border-b border-white/5">
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider rounded-tl-3xl">User Profile</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Contact Info</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Access Role</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Status</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider">Joined Date</th>
                    <th className="p-5 text-xs font-bold text-surface-500 uppercase tracking-wider text-right rounded-tr-3xl">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          {u.avatar ? (
                            <img src={u.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover border border-white/10 shadow-lg" />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-surface-800 to-surface-700 flex items-center justify-center font-bold text-white border border-white/5 shadow-lg group-hover:from-primary-600 group-hover:to-primary-500 transition-all">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">{u.name}</p>
                            <p className="text-[11px] font-mono text-surface-500 mt-0.5">ID: {u._id.substring(18)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <p className="text-sm text-surface-300 font-medium">{u.email}</p>
                        <p className="text-xs text-surface-500 mt-1 flex items-center gap-1">
                          <span className={u.phone ? 'text-surface-400' : 'italic opacity-50'}>{u.phone || 'No phone provided'}</span>
                        </p>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide border ${
                          u.role?.name === 'admin' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : 
                          u.role?.name === 'staff' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                          'bg-surface-800 text-surface-400 border-white/5'
                        }`}>
                          {u.role?.name === 'admin' && <HiOutlineShieldCheck className="w-3.5 h-3.5 mr-1" />}
                          {u.role?.name ? u.role.name.toUpperCase() : 'CLIENT'}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-1.5">
                          {u.status === 'suspended' ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                              <HiBan className="w-3.5 h-3.5" /> Suspended
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-5 text-sm text-surface-400 font-medium">
                        {format(new Date(u.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="p-5 text-right relative">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === u._id ? null : u._id)}
                          className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-xl transition-colors outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <HiDotsVertical className="w-5 h-5" />
                        </button>
                        
                        {openMenuId === u._id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                            <div className="absolute right-8 top-10 w-56 bg-surface-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-100">
                              <div className="px-4 py-2 border-b border-white/5 mb-1">
                                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Manage User</p>
                              </div>
                              <button 
                                onClick={() => handleToggleStatus(u)}
                                className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-white/5 transition-colors font-medium ${u.status === 'suspended' ? 'text-emerald-400' : 'text-amber-400'}`}
                              >
                                {u.status === 'suspended' ? <><HiCheckCircle className="w-4 h-4" /> Activate Account</> : <><HiBan className="w-4 h-4" /> Suspend Account</>}
                              </button>
                              <button 
                                onClick={() => handleMockAction('Password Reset')}
                                className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-white/5 transition-colors text-surface-300 font-medium"
                              >
                                <HiOutlineKey className="w-4 h-4" /> Send Password Reset
                              </button>
                              <div className="h-px bg-white/5 my-1" />
                              <button 
                                onClick={() => handleMockAction('Delete User')}
                                className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-red-500/10 hover:text-red-400 transition-colors text-red-500 font-medium"
                              >
                                <HiOutlineTrash className="w-4 h-4" /> Delete Account
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Invite User Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => !isSubmitting && setShowInviteModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-900 border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-lg relative z-10 shadow-2xl"
            >
              <button onClick={() => !isSubmitting && setShowInviteModal(false)} className="absolute top-6 right-6 p-2 bg-surface-800 hover:bg-surface-700 text-surface-400 hover:text-white rounded-full transition-colors"><HiX className="w-5 h-5" /></button>
              
              <div className="mb-8">
                <div className="w-12 h-12 bg-primary-500/20 text-primary-400 rounded-2xl flex items-center justify-center mb-4">
                  <HiOutlineUserAdd className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white">Invite New User</h2>
                <p className="text-surface-400 text-sm mt-1">Send an invitation email to add a new user to the platform.</p>
              </div>
              
              <form onSubmit={handleInviteUser} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500"><HiOutlineUser className="w-5 h-5" /></span>
                    <input type="text" required value={inviteForm.name} onChange={e => setInviteForm({...inviteForm, name: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:border-primary-500 outline-none transition-colors" placeholder="e.g. Jane Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500"><HiOutlineMail className="w-5 h-5" /></span>
                    <input type="email" required value={inviteForm.email} onChange={e => setInviteForm({...inviteForm, email: e.target.value})} className="w-full bg-surface-800 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:border-primary-500 outline-none transition-colors" placeholder="name@company.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Platform Role</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button type="button" onClick={() => setInviteForm({...inviteForm, role: 'client'})} className={`py-2.5 rounded-xl text-sm font-bold tracking-wide border transition-all ${inviteForm.role === 'client' ? 'bg-surface-700 text-white border-white/20' : 'bg-surface-800 text-surface-500 border-transparent hover:bg-surface-700'}`}>CLIENT</button>
                    <button type="button" onClick={() => setInviteForm({...inviteForm, role: 'staff'})} className={`py-2.5 rounded-xl text-sm font-bold tracking-wide border transition-all ${inviteForm.role === 'staff' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-surface-800 text-surface-500 border-transparent hover:bg-surface-700'}`}>STAFF</button>
                    <button type="button" onClick={() => setInviteForm({...inviteForm, role: 'admin'})} className={`py-2.5 rounded-xl text-sm font-bold tracking-wide border transition-all ${inviteForm.role === 'admin' ? 'bg-primary-500/20 text-primary-400 border-primary-500/50' : 'bg-surface-800 text-surface-500 border-transparent hover:bg-surface-700'}`}>ADMIN</button>
                  </div>
                  <p className="text-xs text-surface-500 mt-2">
                    {inviteForm.role === 'client' && 'Clients can only view and manage their own projects and billing.'}
                    {inviteForm.role === 'staff' && 'Staff can manage assigned projects, view leads, but cannot change global settings.'}
                    {inviteForm.role === 'admin' && 'Admins have full access to all data, settings, and team management.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-4 mt-8">
                  <button type="button" onClick={() => !isSubmitting && setShowInviteModal(false)} className="flex-1 py-3 px-4 bg-surface-800 hover:bg-surface-700 text-white rounded-xl font-medium transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center justify-center">
                    {isSubmitting ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Send Invitation'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UsersManager;
