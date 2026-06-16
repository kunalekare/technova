import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, updateUserRole } from '../../redux/slices/adminSlice';
import { format } from 'date-fns';
import { HiDotsVertical, HiCheckCircle, HiBan } from 'react-icons/hi';
import toast from 'react-hot-toast';

const UsersManager = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin || { users: [], loading: false });
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleToggleStatus = async (user) => {
    try {
      const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
      await dispatch(updateUserRole({ userId: user._id, updateData: { status: newStatus } })).unwrap();
      toast.success(`User ${user.name} is now ${newStatus}`);
    } catch (err) {
      toast.error(err || 'Failed to update user status');
    }
    setOpenMenuId(null);
  };

  return (
    <>
      <Helmet>
        <title>User Management — TechNova</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">User Management</h1>
            <p className="text-surface-400 text-sm mt-1">Manage all client and team accounts.</p>
          </div>
          <button className="btn-primary" onClick={() => toast('Invite coming soon!')}>
            Invite User
          </button>
        </div>

        <div className="glass-card overflow-visible relative">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-surface-400">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="p-4 text-sm font-semibold text-surface-300">User</th>
                    <th className="p-4 text-sm font-semibold text-surface-300">Contact</th>
                    <th className="p-4 text-sm font-semibold text-surface-300">Role</th>
                    <th className="p-4 text-sm font-semibold text-surface-300">Status</th>
                    <th className="p-4 text-sm font-semibold text-surface-300">Joined</th>
                    <th className="p-4 text-sm font-semibold text-surface-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {u.avatar ? (
                            <img src={u.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-white border border-white/10">
                              {u.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors">{u.name}</p>
                            <p className="text-xs text-surface-400">ID: {u._id.substring(18)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-surface-300">{u.email}</p>
                        <p className="text-xs text-surface-400">{u.phone || 'No phone'}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                          u.role?.name === 'admin' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : 
                          u.role?.name === 'staff' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                          'bg-surface-800 text-surface-300 border-white/10'
                        }`}>
                          {u.role?.name ? u.role.name.toUpperCase() : 'CLIENT'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          {u.status === 'suspended' ? (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-red-400 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
                              <HiBan className="w-3.5 h-3.5" /> Suspended
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-surface-400">{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                      <td className="p-4 text-right relative">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === u._id ? null : u._id)}
                          className="p-2 text-surface-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <HiDotsVertical />
                        </button>
                        
                        {openMenuId === u._id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                            <div className="absolute right-8 top-10 w-48 bg-surface-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                              <button 
                                onClick={() => handleToggleStatus(u)}
                                className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-white/5 transition-colors ${u.status === 'suspended' ? 'text-emerald-400' : 'text-red-400'}`}
                              >
                                {u.status === 'suspended' ? <><HiCheckCircle className="w-4 h-4" /> Activate User</> : <><HiBan className="w-4 h-4" /> Suspend User</>}
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
    </>
  );
};

export default UsersManager;
