import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiBriefcase, HiClock, HiDocumentText, HiOutlineOfficeBuilding, HiOutlineChevronRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const mockApplications = [
  {
    id: 'a1',
    title: 'Senior Full Stack Engineer',
    department: 'Core Engineering',
    status: 'Interview Scheduled',
    progress: 75,
    appliedDate: '2026-06-16',
    nextAction: 'Technical Interview on Jun 20',
    color: 'emerald'
  },
  {
    id: 'a2',
    title: 'AI Prompt Architect',
    department: 'Machine Learning',
    status: 'Under Review',
    progress: 30,
    appliedDate: '2026-06-12',
    nextAction: 'Awaiting Recruiter Screen',
    color: 'purple'
  }
];

const MyJobApplications = () => {
  return (
    <>
      <Helmet>
        <title>Job Applications | TechNova</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header section with glow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-surface-900/50 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-inner">
              <HiBriefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">Job Applications</h1>
              <p className="text-surface-400 mt-1">Track your career journey and interview pipelines.</p>
            </div>
          </div>
          <Link to="/careers" className="btn-primary relative z-10 !px-8 !py-4 shadow-lg shadow-primary-500/20 flex items-center gap-2 text-base">
            Browse Opportunities <HiOutlineChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Application Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mockApplications.map((app, i) => (
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
                    <HiOutlineOfficeBuilding className={`w-6 h-6 text-${app.color}-400`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors line-clamp-1">{app.title}</h3>
                    <p className="text-sm text-surface-400 mt-1 font-medium">{app.department}</p>
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
                  <span>Offer</span>
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

              <button className="w-full relative z-10 py-3.5 bg-surface-800 hover:bg-surface-700 text-white font-bold rounded-xl border border-white/10 hover:border-primary-500/50 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                View Detailed Status
                <HiOutlineChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}

          {mockApplications.length === 0 && (
            <div className="col-span-full glass-card p-20 text-center rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px]" />
              <div className="w-24 h-24 bg-surface-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 relative z-10 border border-white/5 rotate-3">
                <HiBriefcase className="w-12 h-12 text-surface-500 -rotate-3" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white relative z-10">No Active Applications</h3>
              <p className="text-surface-400 mt-2 max-w-sm mx-auto relative z-10">You haven't applied to any positions yet. Explore our open roles and join the team.</p>
              <Link to="/careers" className="mt-8 btn-primary inline-flex relative z-10 shadow-lg shadow-primary-500/20 px-8 py-4 text-lg">
                View Open Positions
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyJobApplications;
