import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeamMembers, addTeamMember } from '../../redux/slices/teamSlice';
import { 
  HiUserAdd, HiMail, HiBriefcase, HiOutlineUserGroup, 
  HiX, HiOutlineCode, HiOutlineColorSwatch, HiOutlineSpeakerphone, 
  HiOutlineChip, HiOutlineSupport, HiOutlineClipboardList,
  HiOutlineFolderOpen, HiCheckCircle
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const TeamManager = () => {
  const dispatch = useDispatch();
  const { members, loading } = useSelector((state) => state.team || { members: [], loading: false });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialFormState = {
    email: '',
    designation: '',
    department: 'development',
    skills: '',
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    dispatch(fetchTeamMembers());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatch(addTeamMember(formData)).unwrap();
      toast.success('Team member added successfully');
      setShowAddForm(false);
      setFormData(initialFormState);
    } catch (err) {
      toast.error(err || 'Failed to add team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDepartmentIcon = (dept) => {
    switch(dept) {
      case 'development': return <HiOutlineCode className="w-4 h-4" />;
      case 'design': return <HiOutlineColorSwatch className="w-4 h-4" />;
      case 'marketing': return <HiOutlineSpeakerphone className="w-4 h-4" />;
      case 'ai_ml': return <HiOutlineChip className="w-4 h-4" />;
      case 'support': return <HiOutlineSupport className="w-4 h-4" />;
      case 'management': return <HiOutlineClipboardList className="w-4 h-4" />;
      default: return <HiBriefcase className="w-4 h-4" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Team Management — Admin | TechNova</title>
      </Helmet>

      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Team Management</h1>
            <p className="text-surface-400 text-sm mt-1">Onboard staff, manage designations, and monitor project assignments.</p>
          </div>
          <button 
            className="btn-primary shadow-lg shadow-primary-500/20" 
            onClick={() => setShowAddForm(true)}
          >
            <HiUserAdd className="w-5 h-5 mr-2" /> Add Team Member
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center shrink-0">
              <HiOutlineUserGroup className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-surface-500 font-bold uppercase tracking-wider mb-0.5">Total Staff</p>
              <p className="text-2xl font-bold text-white">{members.length}</p>
            </div>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <HiCheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-surface-500 font-bold uppercase tracking-wider mb-0.5">Available</p>
              <p className="text-2xl font-bold text-white">{members.filter(m => m.availability === 'available').length}</p>
            </div>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <HiBriefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-surface-500 font-bold uppercase tracking-wider mb-0.5">Busy</p>
              <p className="text-2xl font-bold text-white">{members.filter(m => m.availability === 'busy').length}</p>
            </div>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-500/10 text-accent-400 flex items-center justify-center shrink-0">
              <HiOutlineCode className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-surface-500 font-bold uppercase tracking-wider mb-0.5">Engineers</p>
              <p className="text-2xl font-bold text-white">{members.filter(m => m.department === 'development').length}</p>
            </div>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            // Loading Skeletons
            [...Array(4)].map((_, i) => (
              <div key={i} className="glass-card p-6 rounded-3xl h-72 animate-pulse flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-surface-800 mb-4" />
                <div className="w-32 h-4 bg-surface-800 rounded-full mb-2" />
                <div className="w-24 h-3 bg-surface-800 rounded-full mb-6" />
                <div className="w-full flex gap-2 justify-center mb-6">
                  <div className="w-16 h-6 bg-surface-800 rounded-full" />
                  <div className="w-16 h-6 bg-surface-800 rounded-full" />
                </div>
                <div className="w-full h-12 bg-surface-800 rounded-xl mt-auto" />
              </div>
            ))
          ) : members.length === 0 ? (
            <div className="col-span-full py-20 text-center glass-card rounded-3xl border-dashed">
              <HiOutlineUserGroup className="w-12 h-12 text-surface-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">Your team is empty</h3>
              <p className="text-surface-400">Add members to assign them to client projects.</p>
            </div>
          ) : (
            members.map((member, i) => (
              <motion.div 
                key={member._id} 
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden group hover:border-white/10 transition-colors shadow-lg"
              >
                {/* Top decorative gradient */}
                <div className={`absolute top-0 left-0 right-0 h-16 opacity-20 transition-opacity group-hover:opacity-30 bg-gradient-to-b ${
                  member.department === 'design' ? 'from-pink-500' :
                  member.department === 'marketing' ? 'from-amber-500' :
                  member.department === 'ai_ml' ? 'from-purple-500' :
                  'from-primary-500'
                } to-transparent`} />

                {/* Avatar */}
                <div className="relative z-10 mb-4">
                  {member.user?.avatar ? (
                    <img src={member.user.avatar} alt="" className="w-20 h-20 rounded-2xl object-cover border border-white/10 shadow-xl" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-surface-800 flex items-center justify-center text-2xl font-bold text-white border border-white/5 shadow-xl">
                      {member.user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  {/* Availability Dot */}
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-surface-900 ${
                    member.availability === 'available' ? 'bg-emerald-500' :
                    member.availability === 'busy' ? 'bg-amber-500' :
                    'bg-red-500'
                  }`} />
                </div>
                
                {/* Info */}
                <h3 className="text-lg font-bold text-white relative z-10">{member.user?.name || 'Unknown User'}</h3>
                <p className="text-primary-400 text-sm font-medium mb-1 relative z-10">{member.designation}</p>
                <div className="flex items-center gap-1.5 text-xs text-surface-400 font-medium bg-surface-800/50 px-3 py-1 rounded-full mb-5 relative z-10">
                  {getDepartmentIcon(member.department)}
                  <span className="capitalize">{member.department.replace('_', ' & ')}</span>
                </div>
                
                {/* Skills */}
                <div className="flex gap-2 flex-wrap justify-center mb-6 relative z-10 min-h-[50px] content-start">
                  {member.skills?.filter(Boolean).slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-surface-800 text-surface-300 rounded-md text-[10px] uppercase tracking-wider font-bold border border-white/5">
                      {skill.trim()}
                    </span>
                  ))}
                  {member.skills?.filter(Boolean).length > 3 && (
                    <span className="px-2.5 py-1 bg-surface-800 text-surface-500 rounded-md text-[10px] font-bold border border-white/5">
                      +{member.skills.filter(Boolean).length - 3}
                    </span>
                  )}
                </div>

                {/* Footer Stats */}
                <div className="mt-auto w-full pt-4 border-t border-white/5 grid grid-cols-2 gap-4 text-left relative z-10">
                  <div className="bg-surface-800/50 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-surface-500 font-bold uppercase tracking-wider mb-0.5">Projects</p>
                    <div className="flex items-center text-white font-medium text-sm">
                      <HiOutlineFolderOpen className="w-4 h-4 mr-1.5 text-primary-400" />
                      {member.assignedProjects?.length || 0}
                    </div>
                  </div>
                  <div className="bg-surface-800/50 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-surface-500 font-bold uppercase tracking-wider mb-0.5">Status</p>
                    <p className={`text-sm font-medium capitalize ${
                      member.availability === 'available' ? 'text-emerald-400' :
                      member.availability === 'busy' ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {member.availability}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => !isSubmitting && setShowAddForm(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-900 border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-2xl relative z-10 shadow-2xl"
            >
              <button onClick={() => !isSubmitting && setShowAddForm(false)} className="absolute top-6 right-6 p-2 bg-surface-800 hover:bg-surface-700 text-surface-400 hover:text-white rounded-full transition-colors"><HiX className="w-5 h-5" /></button>
              
              <div className="mb-8">
                <div className="w-12 h-12 bg-primary-500/20 text-primary-400 rounded-2xl flex items-center justify-center mb-4">
                  <HiUserAdd className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white">Add Team Member</h2>
                <p className="text-surface-400 text-sm mt-1">Register an existing user as an official team member to assign them projects.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-surface-300 mb-1.5 flex justify-between">
                      <span>Registered User Email</span>
                      <span className="text-xs text-red-400 font-normal">Must match existing account</span>
                    </label>
                    <div className="relative">
                      <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 w-5 h-5" />
                      <input
                        type="email" required
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-surface-800 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:border-primary-500 outline-none transition-colors"
                        placeholder="employee@technova.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Official Designation</label>
                    <div className="relative">
                      <HiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 w-5 h-5" />
                      <input
                        type="text" required
                        value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})}
                        className="w-full bg-surface-800 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:border-primary-500 outline-none transition-colors"
                        placeholder="e.g. Senior Frontend Engineer"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1.5">Department</label>
                    <select
                      value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                      className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="development">Development</option>
                      <option value="design">UI/UX Design</option>
                      <option value="marketing">Marketing & Sales</option>
                      <option value="ai_ml">AI & Machine Learning</option>
                      <option value="support">Customer Support</option>
                      <option value="management">Management</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-surface-300 mb-1.5 flex justify-between">
                      <span>Professional Skills</span>
                      <span className="text-xs text-surface-500 font-normal">Comma separated</span>
                    </label>
                    <input
                      type="text"
                      value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})}
                      className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-colors"
                      placeholder="React, Node.js, AWS, Figma..."
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-4 mt-8">
                  <button type="button" onClick={() => !isSubmitting && setShowAddForm(false)} className="flex-1 py-3 px-4 bg-surface-800 hover:bg-surface-700 text-white rounded-xl font-medium transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center justify-center">
                    {isSubmitting ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Onboard Member'}
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

export default TeamManager;
