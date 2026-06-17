import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { HiSearch } from 'react-icons/hi';
import api from '../../services/api';

const statusConfig = {
  new: { label: 'New', class: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  in_review: { label: 'In Review', class: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  proposal_sent: { label: 'Proposal Sent', class: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  in_progress: { label: 'In Progress', class: 'text-primary-400 bg-primary-500/10 border-primary-500/20' },
  completed: { label: 'Completed', class: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  on_hold: { label: 'On Hold', class: 'text-red-400 bg-red-500/10 border-red-500/20' },
  cancelled: { label: 'Cancelled', class: 'text-surface-400 bg-surface-500/10 border-surface-500/20' },
};

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProjects = async () => {
      try {
        const { data } = await api.get('/admin/projects');
        setProjects(data.data);
      } catch (error) {
        console.error('Failed to fetch admin projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.client?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>All Projects — TechNova</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">All Projects</h1>
            <p className="text-surface-400 text-sm mt-1">Global view of all projects and team assignments.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search projects or clients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-900 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
        </div>

        <div className="glass-card overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="p-12 text-center text-surface-400">Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-12 text-center text-surface-400">No projects found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-sm font-semibold text-surface-300">Project Name</th>
                  <th className="p-4 text-sm font-semibold text-surface-300">Client</th>
                  <th className="p-4 text-sm font-semibold text-surface-300">Status</th>
                  <th className="p-4 text-sm font-semibold text-surface-300">Deadline</th>
                  <th className="p-4 text-sm font-semibold text-surface-300 text-right">Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProjects.map((p) => (
                  <tr key={p._id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => navigate(`/admin/projects/${p._id}`)}>
                    <td className="p-4">
                      <p className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors">{p.title}</p>
                      <p className="text-xs text-surface-400 mt-0.5">{p.service?.title}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-surface-300">{p.client?.name}</p>
                      <p className="text-xs text-surface-500">{p.client?.email}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-[11px] font-medium border ${statusConfig[p.status]?.class || statusConfig.new.class}`}>
                        {statusConfig[p.status]?.label || p.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-surface-400">
                      {p.deadline ? format(new Date(p.deadline), 'MMM d, yyyy') : 'TBD'}
                    </td>
                    <td className="p-4 text-right">
                      {p.assignedTeam?.length > 0 ? (
                        <div className="flex items-center justify-end -space-x-2">
                          {p.assignedTeam.map((team, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-surface-800 border-2 border-surface-900 flex items-center justify-center text-xs text-white" title={team.user?.name}>
                              {team.user?.name?.charAt(0) || '?'}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-surface-500 italic px-2 py-1 bg-surface-900 rounded-md">Unassigned</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectsManager;
