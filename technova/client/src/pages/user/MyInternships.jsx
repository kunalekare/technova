import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiBriefcase, HiClock, HiDocumentText, HiOutlineAcademicCap, HiOutlineChevronRight, HiSparkles } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const mockInternships = [
  {
    id: 'a1',
    title: 'Frontend React Intern',
    company: 'TechNova Core Team',
    status: 'Selected',
    progress: 100,
    appliedDate: '2026-06-01',
    nextAction: 'Pending Offer Letter Acceptance',
    color: 'emerald'
  },
  {
    id: 'a2',
    title: 'Data Science Intern',
    company: 'TechNova Analytics',
    status: 'Technical Assessment',
    progress: 60,
    appliedDate: '2026-06-10',
    nextAction: 'Submit Assignment by Jun 25',
    color: 'pink'
  }
];

const MyInternships = () => {
  return (
    <>
      <Helmet>
        <title>My Internships | TechNova Dashboard</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header section with glow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-surface-900/50 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-inner">
              <HiOutlineAcademicCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">My Internships</h1>
              <p className="text-surface-400 mt-1">Track your internship applications and active programs.</p>
            </div>
          </div>
          <Link to="/internships" className="btn-primary relative z-10 !px-8 !py-4 shadow-lg shadow-primary-500/20 flex items-center gap-2 text-base">
            Find Internships <HiOutlineChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Internships Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mockInternships.map((app, i) => (
            <motion.div 
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-3xl border border-white/5 relative group hover:border-white/10 hover:bg-surface-800/80 transition-all duration-500 overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-40 h-40 bg-${app.color}-500/10 rounded-full blur-[60px] group-hover:bg-${app.color}-500/20 transition-colors duration-500`} />
              
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${app.color}-500/10 flex items-center justify-center border border-${app.color}-500/20 shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <HiOutlineAcademicCap className={`w-6 h-6 text-${app.color}-400`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors line-clamp-1">{app.title}</h3>
                    <p className="text-sm text-surface-400 mt-1 font-medium">{app.company}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-black tracking-widest rounded-lg border uppercase w-fit bg-${app.color}-500/10 text-${app.color}-400 border-${app.color}-500/20`}>
                  {app.status}
                </span>
              </div>

              {/* Animated Progress Bar */}
              <div className="mb-8 relative z-10">
                <div className="flex justify-between text-xs text-surface-400 mb-2 font-medium">
                  <span>Application Submitted</span>
                  <span>Offer Extended</span>
                </div>
                <div className="h-2 w-full bg-surface-900 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${app.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full bg-gradient-to-r from-primary-500 to-${app.color}-400 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)] relative`}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 relative z-10 p-4 bg-surface-900/50 rounded-2xl border border-white/5">
                <div>
                  <p className="text-xs font-bold text-surface-500 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider"><HiClock className="w-4 h-4 text-surface-400" /> Applied On</p>
                  <p className="text-sm text-white font-medium">{app.appliedDate}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-surface-500 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider"><HiDocumentText className="w-4 h-4 text-primary-400" /> Next Step</p>
                  <p className="text-sm text-primary-300 font-bold">{app.nextAction}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                <button className="w-full sm:flex-1 py-3.5 bg-surface-800 hover:bg-surface-700 text-white font-bold rounded-xl border border-white/10 hover:border-primary-500/50 transition-all duration-300 flex items-center justify-center gap-2">
                  View Status
                </button>
                {app.status === 'Selected' && (
                  <button className="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl border border-white/10 shadow-lg shadow-emerald-500/25 transition-all duration-300 flex items-center justify-center gap-2">
                    <HiSparkles className="w-5 h-5" />
                    Intern Dashboard
                  </button>
                )}
              </div>
            </motion.div>
          ))}

          {mockInternships.length === 0 && (
            <div className="col-span-full glass-card p-20 text-center rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px]" />
              <div className="w-24 h-24 bg-surface-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 relative z-10 border border-white/5 rotate-3">
                <HiOutlineAcademicCap className="w-12 h-12 text-surface-500 -rotate-3" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white relative z-10">No Active Internships</h3>
              <p className="text-surface-400 mt-2 max-w-sm mx-auto relative z-10">You haven't applied to any internships yet. Start your journey by exploring our student programs.</p>
              <Link to="/internships" className="mt-8 btn-primary inline-flex relative z-10 shadow-lg shadow-primary-500/20 px-8 py-4 text-lg">
                Explore Programs
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyInternships;
