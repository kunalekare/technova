import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeamMembers, addTeamMember } from '../../redux/slices/teamSlice';
import { HiUserAdd, HiMail, HiBriefcase } from 'react-icons/hi';
import toast from 'react-hot-toast';

const TeamManager = () => {
  const dispatch = useDispatch();
  const { members, loading } = useSelector((state) => state.team || { members: [], loading: false });
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    designation: '',
    department: 'development',
    skills: '',
  });

  useEffect(() => {
    dispatch(fetchTeamMembers());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addTeamMember(formData)).unwrap();
      toast.success('Team member added successfully');
      setShowAddForm(false);
      setFormData({ email: '', designation: '', department: 'development', skills: '' });
    } catch (err) {
      toast.error(err || 'Failed to add team member');
    }
  };

  return (
    <>
      <Helmet>
        <title>Team Management — TechNova Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Team Management</h1>
            <p className="text-surface-400 text-sm mt-1">Assign roles and manage team workload.</p>
          </div>
          <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            <HiUserAdd className="w-5 h-5 mr-1" /> Add Member
          </button>
        </div>

        {showAddForm && (
          <div className="glass-card p-6 border-primary-500/20">
            <h3 className="text-lg font-semibold text-white mb-4">Add Team Member</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1">User Email (must be registered)</label>
                <div className="relative">
                  <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="input-field pl-10"
                    placeholder="member@technova.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1">Designation</label>
                <div className="relative">
                  <HiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={e => setFormData({...formData, designation: e.target.value})}
                    className="input-field pl-10"
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1">Department</label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({...formData, department: e.target.value})}
                  className="input-field"
                >
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="ai_ml">AI & ML</option>
                  <option value="support">Support</option>
                  <option value="management">Management</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={e => setFormData({...formData, skills: e.target.value})}
                  className="input-field"
                  placeholder="React, Node.js, AWS"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full p-12 text-center text-surface-400">Loading team...</div>
          ) : members.length === 0 ? (
            <div className="col-span-full glass-card p-12 text-center text-surface-400">No team members found.</div>
          ) : (
            members.map((member) => (
              <div key={member._id} className="glass-card p-6 flex flex-col items-center text-center hover:border-primary-500/20 transition-colors">
                {member.user?.avatar ? (
                  <img src={member.user.avatar} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-white/10 mb-4" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl font-bold text-white border-2 border-white/10 mb-4">
                    {member.user?.name?.charAt(0) || '?'}
                  </div>
                )}
                
                <h3 className="text-lg font-bold text-white">{member.user?.name}</h3>
                <p className="text-primary-400 text-sm font-medium">{member.designation}</p>
                <p className="text-xs text-surface-400 mt-1">{member.user?.email}</p>
                
                <div className="flex gap-2 mt-4 flex-wrap justify-center">
                  {member.skills?.slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-surface-800 text-surface-300 rounded text-[10px] uppercase tracking-wider font-semibold border border-white/5">
                      {skill}
                    </span>
                  ))}
                  {member.skills?.length > 3 && (
                    <span className="px-2 py-1 bg-surface-800 text-surface-400 rounded text-[10px] font-semibold border border-white/5">
                      +{member.skills.length - 3}
                    </span>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 w-full flex justify-between items-center text-xs">
                  <div className="text-surface-400">
                    <span className="text-white font-medium">{member.assignedProjects?.length || 0}</span> Projects
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full border ${
                      member.availability === 'available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      member.availability === 'busy' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {member.availability.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default TeamManager;
