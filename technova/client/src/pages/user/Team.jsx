import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSentInvites, sendTeamInvite, revokeTeamInvite, resetInviteSuccess } from '../../redux/slices/teamInviteSlice';
import { fetchMyProjects } from '../../redux/slices/projectSlice';
import { HiUserAdd, HiTrash, HiCheckCircle, HiClock } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Team = () => {
  const dispatch = useDispatch();
  const { invites, loading, inviteSuccess, error } = useSelector((state) => state.teamInvites);
  const { projects } = useSelector((state) => state.project);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    inviteeEmail: '',
    role: 'viewer',
    projectScope: [], // Array of project IDs
  });

  useEffect(() => {
    dispatch(fetchSentInvites());
    dispatch(fetchMyProjects());
  }, [dispatch]);

  useEffect(() => {
    if (inviteSuccess) {
      toast.success('Invite sent successfully!');
      setFormData({ inviteeEmail: '', role: 'viewer', projectScope: [] });
      dispatch(resetInviteSuccess());
    }
    if (error) {
      toast.error(error);
      dispatch(resetInviteSuccess());
    }
  }, [inviteSuccess, error, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProjectToggle = (projectId) => {
    setFormData(prev => {
      const isSelected = prev.projectScope.includes(projectId);
      if (isSelected) {
        return { ...prev, projectScope: prev.projectScope.filter(id => id !== projectId) };
      } else {
        return { ...prev, projectScope: [...prev.projectScope, projectId] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendTeamInvite(formData));
  };

  if (user?.parentAccount) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl text-white mb-2">Access Denied</h2>
        <p className="text-surface-400">Only the primary account holder can invite teammates.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="glass-card p-6 border-l-4 border-primary-500 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Team Access</h2>
          <p className="text-surface-300">Invite teammates and assign them project-specific access scopes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invite Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">Send New Invite</h3>
            
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1">Email Address</label>
              <input
                type="email"
                name="inviteeEmail"
                required
                value={formData.inviteeEmail}
                onChange={handleChange}
                placeholder="teammate@example.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1">Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="input-field">
                <option value="viewer">Viewer (Read-only)</option>
                <option value="editor">Editor (Can make changes)</option>
                <option value="finance">Finance (Access to escrow/payments)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Project Scope</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {projects.map(project => (
                  <label key={project._id} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.projectScope.includes(project._id)}
                      onChange={() => handleProjectToggle(project._id)}
                      className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500 bg-surface-800 border-white/10"
                    />
                    <span className="text-sm text-surface-300 line-clamp-1">{project.title}</span>
                  </label>
                ))}
                {projects.length === 0 && <p className="text-sm text-surface-500">No active projects available.</p>}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary flex justify-center items-center gap-2 mt-4">
              <HiUserAdd className="w-5 h-5" />
              {loading ? 'Sending...' : 'Send Invite'}
            </button>
          </form>
        </div>

        {/* Invites List */}
        <div className="lg:col-span-2">
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Active & Pending Invites</h3>
            </div>
            
            {invites.length === 0 ? (
              <div className="p-8 text-center text-surface-400">
                No team invites sent yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-900/50">
                      <th className="px-4 py-3 text-sm font-medium text-surface-400">Email</th>
                      <th className="px-4 py-3 text-sm font-medium text-surface-400">Role</th>
                      <th className="px-4 py-3 text-sm font-medium text-surface-400">Scope</th>
                      <th className="px-4 py-3 text-sm font-medium text-surface-400">Status</th>
                      <th className="px-4 py-3 text-sm font-medium text-surface-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {invites.map((invite) => (
                      <tr key={invite._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4">
                          <span className="text-sm text-white font-medium">{invite.inviteeEmail}</span>
                        </td>
                        <td className="px-4 py-4 text-sm text-surface-300 capitalize">{invite.role}</td>
                        <td className="px-4 py-4 text-sm text-surface-300">
                          {invite.projectScope.length} Projects
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {invite.status === 'accepted' && (
                            <span className="flex items-center gap-1 text-green-400">
                              <HiCheckCircle /> Accepted
                            </span>
                          )}
                          {invite.status === 'pending' && (
                            <span className="flex items-center gap-1 text-yellow-400">
                              <HiClock /> Pending
                            </span>
                          )}
                          {invite.status === 'revoked' && (
                            <span className="flex items-center gap-1 text-red-400">
                              Revoked
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          {invite.status !== 'revoked' && (
                            <button
                              onClick={() => dispatch(revokeTeamInvite(invite._id))}
                              className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded transition-colors"
                              title="Revoke Access"
                            >
                              <HiTrash className="w-5 h-5" />
                            </button>
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
      </div>
    </div>
  );
};

export default Team;
