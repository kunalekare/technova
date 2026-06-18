import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiUserGroup, HiCurrencyRupee, HiCheckCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const mockHires = [
  {
    id: 'h1',
    talentName: 'Sarah Jenkins',
    talentTitle: 'Senior React Native Developer',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    projectTitle: 'E-commerce Mobile App MVP',
    status: 'Active',
    startDate: '2026-05-15',
    budget: '$45/hr'
  }
];

const MyHires = () => {
  return (
    <>
      <Helmet>
        <title>My Hires | Velixora Dashboard</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header section with glow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-surface-900/50 p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-emerald-500/20 flex items-center justify-center border border-white/10 shadow-inner">
              <HiUserGroup className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">My Hires</h1>
              <p className="text-surface-400 mt-1">Manage your hired talent and active engagements.</p>
            </div>
          </div>
          <Link to="/hire" className="btn-primary relative z-10 !px-6 !py-3 shadow-lg shadow-primary-500/20 flex items-center gap-2 text-sm md:text-base">
            Hire More Talent
          </Link>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockHires.map((hire, i) => (
          <motion.div 
            key={hire.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 border-primary-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="badge-primary !bg-emerald-500/10 !text-emerald-400 border border-emerald-500/20">
                {hire.status}
              </span>
              <span className="text-xs text-surface-500">Started: {hire.startDate}</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <img src={hire.avatar} alt={hire.talentName} className="w-12 h-12 rounded-full border-2 border-surface-700" />
              <div>
                <h3 className="font-bold text-white">{hire.talentName}</h3>
                <p className="text-xs text-primary-400">{hire.talentTitle}</p>
              </div>
            </div>

            <div className="p-4 bg-surface-900 rounded-xl border border-white/5 mb-6">
              <p className="text-xs text-surface-500 mb-1">Project</p>
              <p className="text-sm font-medium text-white mb-3">{hire.projectTitle}</p>
              <p className="text-xs text-surface-500 mb-1">Budget / Rate</p>
              <p className="text-sm font-medium text-white">{hire.budget}</p>
            </div>

            <div className="flex gap-2">
              <button className="btn-secondary flex-1 !py-2 text-sm">Message</button>
              <button className="btn-primary flex-1 !py-2 text-sm">Manage</button>
            </div>
          </motion.div>
        ))}

        {/* Empty State placeholder if needed */}
        {mockHires.length === 0 && (
           <div className="col-span-full glass-card p-12 text-center border-dashed">
            <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
              <HiUserGroup className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No active hires</h3>
            <p className="text-surface-400 mb-6">You haven't hired any professionals yet.</p>
            <Link to="/hire" className="btn-primary">Browse Talent</Link>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default MyHires;
