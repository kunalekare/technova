import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiUserGroup, HiBadgeCheck, HiXCircle } from 'react-icons/hi';

const mockTalentApps = [
  {
    id: 'ta1',
    applicantName: 'Michael Chang',
    title: 'Senior Python Engineer',
    appliedOn: '2026-06-15',
    status: 'Pending',
    hourlyRate: 55,
  }
];

const mockHiringRequests = [
  {
    id: 'hr1',
    clientName: 'Acme Corp',
    talentName: 'Sarah Jenkins',
    project: 'E-commerce Mobile App MVP',
    status: 'Pending',
    budget: '$45/hr'
  }
];

const AdminTalent = () => {
  return (
    <>
      <Helmet>
        <title>Talent Management | Admin Dashboard</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">Talent Management</h1>
        <p className="text-surface-400">Review talent applications and oversee hiring requests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Talent Applications */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Pending Talent Applications</h2>
          <div className="space-y-4">
            {mockTalentApps.map((app, i) => (
              <motion.div 
                key={app.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-white">{app.applicantName}</h3>
                    <p className="text-sm text-primary-400">{app.title}</p>
                  </div>
                  <span className="badge-primary !bg-yellow-500/10 !text-yellow-400 border border-yellow-500/20">
                    {app.status}
                  </span>
                </div>
                <div className="text-sm text-surface-400 mb-4 flex justify-between">
                  <span>Applied: {app.appliedOn}</span>
                  <span>Rate: ${app.hourlyRate}/hr</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors flex justify-center items-center gap-1 text-sm font-medium">
                    <HiBadgeCheck className="w-4 h-4"/> Approve
                  </button>
                  <button className="flex-1 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex justify-center items-center gap-1 text-sm font-medium">
                    <HiXCircle className="w-4 h-4"/> Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hiring Requests */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Active Hiring Requests</h2>
          <div className="space-y-4">
            {mockHiringRequests.map((req, i) => (
              <motion.div 
                key={req.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 border-l-4 border-l-primary-500"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-white">{req.project}</h3>
                    <p className="text-sm text-surface-400">{req.clientName} hiring {req.talentName}</p>
                  </div>
                  <span className="badge-primary !bg-yellow-500/10 !text-yellow-400 border border-yellow-500/20">
                    {req.status}
                  </span>
                </div>
                <div className="p-3 bg-surface-900 rounded-lg mb-4 text-sm text-surface-300">
                  <span className="text-surface-500 mr-2">Budget:</span> {req.budget}
                </div>
                <button className="btn-primary w-full py-2 text-sm">Generate Agreement</button>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default AdminTalent;
