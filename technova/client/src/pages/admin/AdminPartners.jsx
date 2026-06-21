import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';

const AdminPartners = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    api.get('/partners/applications')
      .then(res => setApplications(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/partners/applications/${id}`, { status, reviewNotes: 'Reviewed by admin' });
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Partners | Admin</title>
      </Helmet>
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-8">Partner Applications</h1>

        {loading ? (
          <p className="text-surface-400">Loading...</p>
        ) : applications.length === 0 ? (
          <div className="glass-card p-8 text-center text-surface-400">No applications found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {applications.map(app => (
              <div key={app._id} className="glass-card p-6 border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{app.partner?.user?.name} ({app.partner?.type})</h3>
                    <p className="text-surface-400 text-sm">{app.partner?.user?.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                    app.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                    app.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-surface-300 mb-1">Skills:</p>
                  <div className="flex gap-2 flex-wrap">
                    {app.partner?.skills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-surface-700 text-xs rounded-lg text-white">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-surface-300"><strong>Portfolio:</strong> <a href={app.portfolioLink} target="_blank" className="text-primary-400">{app.portfolioLink}</a></p>
                  <p className="text-sm text-surface-300 mt-2"><strong>Cover Letter:</strong> {app.coverLetter}</p>
                </div>
                
                {app.status === 'pending' && (
                  <div className="flex gap-3">
                    <button onClick={() => handleStatusChange(app._id, 'approved')} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-bold hover:bg-emerald-500/30 transition-colors">Approve</button>
                    <button onClick={() => handleStatusChange(app._id, 'rejected')} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-bold hover:bg-red-500/30 transition-colors">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPartners;
