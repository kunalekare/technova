import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiBriefcase, HiClock, HiDocumentText } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const mockApplications = [
  {
    id: 'a1',
    title: 'Senior Full Stack Engineer',
    department: 'Engineering',
    status: 'Interview Scheduled',
    appliedDate: '2026-06-16',
    nextAction: 'Technical Interview on Jun 20'
  }
];

const MyJobApplications = () => {
  return (
    <>
      <Helmet>
        <title>My Job Applications | TechNova Dashboard</title>
      </Helmet>

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">My Applications</h1>
          <p className="text-surface-400">Track your job applications and interview status.</p>
        </div>
        <Link to="/careers" className="btn-primary">Browse Jobs</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockApplications.map((app, i) => (
          <motion.div 
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <HiBriefcase className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{app.title}</h3>
                  <p className="text-xs text-surface-400">{app.department}</p>
                </div>
              </div>
              <span className="badge-primary !bg-emerald-500/10 !text-emerald-400 border border-emerald-500/20">
                {app.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-surface-500 flex items-center gap-1 mb-1"><HiClock /> Applied On</p>
                <p className="text-sm text-white font-medium">{app.appliedDate}</p>
              </div>
              <div>
                <p className="text-xs text-surface-500 flex items-center gap-1 mb-1"><HiDocumentText /> Next Step</p>
                <p className="text-sm text-accent-400 font-medium">{app.nextAction}</p>
              </div>
            </div>

            <button className="btn-secondary w-full !py-2 text-sm">View Status</button>
          </motion.div>
        ))}

        {mockApplications.length === 0 && (
          <div className="col-span-full glass-card p-12 text-center border-dashed">
            <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
              <HiBriefcase className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Applications Yet</h3>
            <p className="text-surface-400 mb-6">You haven't applied to any jobs.</p>
            <Link to="/careers" className="btn-primary">Find Jobs</Link>
          </div>
        )}
      </div>
    </>
  );
};

export default MyJobApplications;
