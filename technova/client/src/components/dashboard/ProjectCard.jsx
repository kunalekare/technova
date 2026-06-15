import { Link } from 'react-router-dom';
import { HiClock, HiOutlineChevronRight } from 'react-icons/hi';
import { format } from 'date-fns';

const statusColors = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  in_progress: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  in_review: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const ProjectCard = ({ project }) => {
  return (
    <Link 
      to={`/dashboard/projects/${project._id}`}
      className="block glass-card p-5 hover:bg-white/[0.04] transition-colors group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-surface-400 mt-1">{project.service?.title}</p>
        </div>
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${statusColors[project.status] || statusColors.new}`}>
          {project.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-surface-400">
          <HiClock className="w-4 h-4 mr-1.5" />
          <span>Updated {format(new Date(project.updatedAt), 'MMM d, yyyy')}</span>
        </div>
        <div className="flex items-center text-primary-400 font-medium group-hover:translate-x-1 transition-transform">
          View Details
          <HiOutlineChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
