import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateScope, resetScope } from '../../redux/slices/aiSlice';
import { HiSparkles, HiLightningBolt, HiOutlineClock } from 'react-icons/hi';

const ProjectScoper = () => {
  const dispatch = useDispatch();
  const { projectScope, loadingScope } = useSelector((state) => state.ai || {});
  const [description, setDescription] = useState('');

  const handleGenerate = () => {
    if (!description.trim()) return;
    dispatch(generateScope(description));
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-white/5 bg-gradient-to-br from-surface-900 to-surface-950">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center border border-primary-500/30">
            <HiSparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-display font-bold text-white">AI Project Scoper</h2>
        </div>
        <p className="text-surface-400 text-sm">Describe your idea, and our AI will architect the tech stack and roadmap.</p>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. I need a scalable e-commerce app with an admin dashboard, user profiles, and Stripe integration..."
            className="input-field w-full min-h-[120px] resize-none"
            disabled={loadingScope}
          />
          <div className="mt-4 flex justify-end gap-3">
            {projectScope && (
              <button
                onClick={() => dispatch(resetScope())}
                className="btn-outline text-sm py-2 px-4"
              >
                Reset
              </button>
            )}
            <button
              onClick={handleGenerate}
              disabled={!description.trim() || loadingScope}
              className="btn-primary flex items-center gap-2"
            >
              {loadingScope ? 'Architecting...' : 'Generate Plan'}
              <HiLightningBolt className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Response Output */}
        {projectScope && (
          <div className="animate-fade-in space-y-6 border-t border-white/5 pt-6 mt-6">
            <div>
              <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-2">Architecture Summary</h3>
              <p className="text-surface-300">{projectScope.summary}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {projectScope.suggestedTechStack?.map((tech, idx) => (
                <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white">
                  {tech}
                </span>
              ))}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                Proposed Milestones
                <span className="text-surface-500 text-xs normal-case flex items-center gap-1 bg-surface-900 px-2 py-1 rounded-md">
                  <HiOutlineClock /> {projectScope.estimatedTimeline}
                </span>
              </h3>
              <div className="space-y-4">
                {projectScope.milestones?.map((milestone, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-800 border border-white/10 flex items-center justify-center text-surface-400 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{milestone.title}</h4>
                      <p className="text-surface-400 text-sm mt-1">{milestone.description}</p>
                      <p className="text-xs text-primary-500 mt-2 font-medium">Est: {milestone.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary-900/20 border border-primary-500/20 rounded-lg p-4 flex justify-between items-center">
              <div>
                <h4 className="text-white font-medium">Ready to build this?</h4>
                <p className="text-surface-400 text-sm">Submit these requirements to start the project.</p>
              </div>
              <button className="btn-primary text-sm py-2">Submit Requirements</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectScoper;
