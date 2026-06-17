import { Link } from 'react-router-dom';
import { HiClock, HiOutlineChevronRight, HiFolderOpen } from 'react-icons/hi';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const statusStyles = {
  new: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', glow: 'shadow-blue-500/20' },
  in_progress: { bg: 'bg-primary-500/10', text: 'text-primary-400', border: 'border-primary-500/20', glow: 'shadow-primary-500/20' },
  completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/20' },
  in_review: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', glow: 'shadow-purple-500/20' },
  proposal_sent: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', glow: 'shadow-pink-500/20' },
  on_hold: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', glow: 'shadow-amber-500/20' },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', glow: 'shadow-red-500/20' },
};

const ProjectCard = ({ project }) => {
  const statusTheme = statusStyles[project.status] || statusStyles.new;

  return (
    <Link 
      to={`/dashboard/projects/${project._id}`}
      className="block relative group h-full"
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${statusTheme.glow} shadow-xl`} />
      
      <div className="glass-card p-6 rounded-3xl h-full flex flex-col hover:border-white/10 hover:bg-surface-800/80 transition-all duration-300 relative overflow-hidden border border-white/5">
        
        {/* Subtle background glow based on status */}
        <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[60px] opacity-20 pointer-events-none transition-colors duration-300 ${statusTheme.bg.replace('/10', '')}`} />

        <div className="flex items-start justify-between mb-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${statusTheme.bg} ${statusTheme.text} ${statusTheme.border} group-hover:scale-105 transition-transform duration-300`}>
              <HiFolderOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors line-clamp-1">
                {project.title}
              </h3>
              <p className="text-sm font-medium text-surface-400 mt-1 line-clamp-1">{project.service?.title || 'Custom Project'}</p>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
          <div className="flex flex-col gap-2">
            <span className={`px-3 py-1 text-[10px] font-black tracking-widest rounded-lg border uppercase w-fit ${statusTheme.bg} ${statusTheme.text} ${statusTheme.border}`}>
              {project.status.replace('_', ' ')}
            </span>
            <div className="flex items-center text-xs font-medium text-surface-500">
              <HiClock className="w-3.5 h-3.5 mr-1" />
              <span>Updated {format(new Date(project.updatedAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-900 border border-white/5 text-surface-400 group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-400 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] shrink-0">
            <HiOutlineChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
