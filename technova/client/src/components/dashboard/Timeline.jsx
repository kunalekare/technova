import { format } from 'date-fns';
import { HiCheck, HiClock, HiOutlineDotsHorizontal } from 'react-icons/hi';

const Timeline = ({ milestones = [] }) => {
  if (!milestones.length) {
    return <div className="text-surface-400 text-sm py-4">No milestones defined yet.</div>;
  }

  return (
    <div className="space-y-6">
      {milestones.map((milestone, index) => {
        const isLast = index === milestones.length - 1;
        const isCompleted = milestone.status === 'completed';
        const isInProgress = milestone.status === 'in_progress';

        return (
          <div key={milestone._id || index} className="relative flex gap-4">
            {/* Timeline Line */}
            {!isLast && (
              <div className={`absolute top-8 left-[15px] bottom-[-24px] w-px ${isCompleted ? 'bg-primary-500' : 'bg-white/10'}`} />
            )}

            {/* Timeline Icon */}
            <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 
              ${isCompleted 
                ? 'bg-primary-500 border-primary-500 text-white' 
                : isInProgress
                  ? 'bg-surface-900 border-primary-500 text-primary-500'
                  : 'bg-surface-900 border-white/20 text-surface-500'
              }`}
            >
              {isCompleted ? <HiCheck className="w-4 h-4" /> : isInProgress ? <HiOutlineDotsHorizontal className="w-4 h-4" /> : <HiClock className="w-4 h-4" />}
            </div>

            {/* Timeline Content */}
            <div className="flex-1 pb-2">
              <h4 className={`text-sm font-semibold ${isCompleted || isInProgress ? 'text-white' : 'text-surface-300'}`}>
                {milestone.title}
              </h4>
              {milestone.description && (
                <p className="text-sm text-surface-400 mt-1">{milestone.description}</p>
              )}
              {milestone.dueDate && (
                <p className="text-xs text-surface-500 mt-2">
                  Due: {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
