import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../redux/slices/adminSlice';
import { format } from 'date-fns';

const UsersManager = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin || { users: [], loading: false });

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>User Management — TechNova</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-white">User Management</h1>
          <button className="btn-primary">Invite User</button>
        </div>

        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-surface-400">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="p-4 text-sm font-semibold text-surface-300">Name</th>
                    <th className="p-4 text-sm font-semibold text-surface-300">Email</th>
                    <th className="p-4 text-sm font-semibold text-surface-300">Role</th>
                    <th className="p-4 text-sm font-semibold text-surface-300">Joined</th>
                    <th className="p-4 text-sm font-semibold text-surface-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-sm font-medium text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold">
                          {u.name.charAt(0)}
                        </div>
                        {u.name}
                      </td>
                      <td className="p-4 text-sm text-surface-300">{u.email}</td>
                      <td className="p-4 text-sm">
                        <span className="px-2 py-1 bg-surface-800 text-surface-300 rounded-md text-xs border border-white/10">
                          {u.role?.name || 'client'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-surface-400">{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                      <td className="p-4 text-right">
                        <button className="text-sm text-primary-400 hover:text-primary-300">Edit</button>
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
