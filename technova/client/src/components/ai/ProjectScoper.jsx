import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { generateScope, resetScope } from '../../redux/slices/aiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSparkles, HiLightningBolt, HiOutlineClock, HiOutlineCubeTransparent, HiOutlineCheckCircle } from 'react-icons/hi';

const ProjectScoper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectScope, loadingScope } = useSelector((state) => state.ai || {});
  const [description, setDescription] = useState('');

  const handleGenerate = () => {
    if (!description.trim()) return;
    dispatch(generateScope(description));
  };

  const handleCreateProject = () => {
    // Navigate to new project form, optionally passing the AI generated scope state
    navigate('/dashboard/projects?new=true', { state: { predefinedScope: projectScope, description } });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Area */}
      <div className="text-center space-y-4 mb-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-0.5 shadow-lg shadow-purple-500/25 relative z-10">
          <div className="w-full h-full bg-surface-950 rounded-xl flex items-center justify-center">
            <HiSparkles className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white relative z-10">AI Project Architect</h1>
        <p className="text-surface-400 max-w-2xl mx-auto text-lg relative z-10">Describe your software idea in plain English. Our AI will instantly architect the perfect technology stack, timeline, and roadmap.</p>
      </div>

      {/* Input Section */}
      <div className="glass-card p-2 rounded-3xl border border-white/5 relative z-10 shadow-2xl">
        <div className="bg-surface-900 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-primary-500 opacity-50" />
          
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. I need a scalable e-commerce app with an admin dashboard, user profiles, and Stripe integration..."
            className="w-full min-h-[140px] bg-transparent text-white text-lg placeholder:text-surface-600 focus:outline-none resize-none"
            disabled={loadingScope}
          />
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-sm text-surface-500">
              <HiOutlineCubeTransparent className="w-5 h-5 text-purple-500" />
              <span>Be as detailed or as brief as you like.</span>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              {projectScope && (
                <button
                  onClick={() => {
                    setDescription('');
                    dispatch(resetScope());
                  }}
                  className="px-6 py-3 rounded-xl font-bold text-surface-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                onClick={handleGenerate}
                disabled={!description.trim() || loadingScope}
                className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loadingScope ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Architecting...
                  </>
                ) : (
                  <>
                    <HiLightningBolt className="w-5 h-5" />
                    {projectScope ? 'Regenerate Plan' : 'Generate Blueprint'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State Overlay */}
      <AnimatePresence>
        {loadingScope && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="glass-card p-12 text-center rounded-3xl border border-purple-500/20"
          >
            <div className="w-20 h-20 mx-auto relative mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
              <HiSparkles className="absolute inset-0 m-auto w-8 h-8 text-purple-400 animate-pulse" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-2">Analyzing Requirements...</h3>
            <p className="text-surface-400">Selecting optimal frameworks and plotting development milestones.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Output */}
      <AnimatePresence>
        {!loadingScope && projectScope && (
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="space-y-6"
          >
            {/* Top Cards: Summary & Tech Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Architecture Summary */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-[40px] group-hover:bg-primary-500/20 transition-colors" />
                <h3 className="text-sm font-bold text-primary-400 uppercase tracking-widest mb-4">Architecture Summary</h3>
                <p className="text-white text-lg leading-relaxed relative z-10">{projectScope.summary}</p>
              </motion.div>

              {/* Recommended Tech Stack */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-[40px] group-hover:bg-pink-500/20 transition-colors" />
                <h3 className="text-sm font-bold text-pink-400 uppercase tracking-widest mb-4">Recommended Tech Stack</h3>
                <div className="flex flex-wrap gap-3 relative z-10">
                  {projectScope.suggestedTechStack?.map((tech, idx) => (
                    <motion.span 
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + (idx * 0.05) }}
                      key={idx} 
                      className="px-4 py-2 bg-surface-800 border border-white/10 rounded-xl text-sm font-bold text-white shadow-lg hover:border-pink-500/50 hover:text-pink-300 transition-colors cursor-default"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Timeline / Milestones */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 sm:p-10 rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-primary-500 opacity-20" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div>
                  <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-1">Development Roadmap</h3>
                  <h2 className="text-2xl font-display font-bold text-white">Proposed Milestones</h2>
                </div>
                <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-xl">
                  <HiOutlineClock className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 font-bold">Est. Timeline: {projectScope.estimatedTimeline}</span>
                </div>
              </div>

              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-pink-500 before:to-transparent">
                {projectScope.milestones?.map((milestone, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + (idx * 0.1) }}
                    key={idx} 
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    {/* Timeline Dot */}
                    <div className="flex items-center justify-center w-9 h-9 rounded-full border-4 border-surface-950 bg-purple-500 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative left-0 md:left-1/2 -ml-[0.25rem] md:ml-0">
                      {idx + 1}
                    </div>
                    
                    {/* Content Card */}
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-surface-800/50 border border-white/5 hover:border-purple-500/30 transition-colors hover:bg-surface-800 shadow-xl ml-4 md:ml-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h4 className="text-lg font-bold text-white">{milestone.title}</h4>
                        <span className="text-xs font-bold text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-md shrink-0">
                          {milestone.duration}
                        </span>
                      </div>
                      <p className="text-surface-400 text-sm leading-relaxed">{milestone.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Call to Action Box */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }} className="relative rounded-3xl overflow-hidden p-1 border border-primary-500/30 bg-gradient-to-r from-primary-500/20 to-purple-500/20">
              <div className="bg-surface-900 rounded-[1.3rem] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left relative z-10">
                <div>
                  <h4 className="text-2xl font-display font-bold text-white mb-2">Ready to bring this blueprint to life?</h4>
                  <p className="text-surface-400">Click below to convert this AI architecture into an official project request.</p>
                </div>
                <button 
                  onClick={handleCreateProject}
                  className="shrink-0 px-8 py-4 bg-white text-surface-950 hover:bg-surface-200 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2 text-lg"
                >
                  <HiOutlineCheckCircle className="w-6 h-6" />
                  Submit Request
                </button>
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProjectScoper;
