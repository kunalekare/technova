import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  HiArrowLeft, HiCalendar, HiCurrencyRupee, HiUsers,
  HiDocumentDownload, HiChat, HiClipboardList, HiClock,
  HiCheckCircle, HiExclamation, HiPhotograph
} from 'react-icons/hi';
import { fetchProjectById, clearCurrentProject } from '../../redux/slices/projectSlice';
import Timeline from '../../components/dashboard/Timeline';
import ChatWidget from '../../components/dashboard/ChatWidget';

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: HiClock },
  in_review: { label: 'In Review', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: HiClipboardList },
  proposal_sent: { label: 'Proposal Sent', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icon: HiDocumentDownload },
  in_progress: { label: 'In Progress', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: HiExclamation },
  completed: { label: 'Completed', color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: HiCheckCircle },
  on_hold: { label: 'On Hold', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', icon: HiClock },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: HiExclamation },
};

const tabs = ['overview', 'milestones', 'team', 'files', 'chat'];

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProject: project, loading } = useSelector((state) => state.project);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(fetchProjectById(id));
    return () => dispatch(clearCurrentProject());
  }, [dispatch, id]);

  if (loading || !project) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-surface-400">Loading project details...</p>
        </div>
      </div>
    );
  }

  const status = statusConfig[project.status] || statusConfig.new;
  const StatusIcon = status.icon;

  // Status timeline steps for visual tracker
  const allStatuses = ['new', 'in_review', 'proposal_sent', 'in_progress', 'completed'];
  const currentStep = allStatuses.indexOf(project.status);

  return (
    <>
      <Helmet>
        <title>{project.title} — Velixora</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Back Button */}
        <Link to="/dashboard/projects" className="inline-flex items-center text-sm text-surface-400 hover:text-white transition-colors">
          <HiArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Projects
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-white">{project.title}</h1>
              <p className="text-surface-400 text-sm mt-1">{project.service?.title}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${status.color}`}>
              <StatusIcon className="w-4 h-4" />
              {status.label}
            </span>
          </div>

          {/* Status Progress Track */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {allStatuses.map((s, i) => {
                const isCompleted = i <= currentStep;
                const isCurrent = i === currentStep;
                return (
                  <div key={s} className="flex flex-col items-center flex-1 relative">
                    {i > 0 && (
                      <div className={`absolute top-3 right-1/2 left-[-50%] h-0.5 ${isCompleted ? 'bg-primary-500' : 'bg-surface-700'}`} />
                    )}
                    <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCurrent ? 'bg-primary-500 text-white ring-4 ring-primary-500/20' :
                      isCompleted ? 'bg-primary-500 text-white' : 'bg-surface-700 text-surface-400'
                    }`}>
                      {isCompleted ? '✓' : i + 1}
                    </div>
                    <span className={`text-[10px] mt-2 font-medium text-center ${
                      isCurrent ? 'text-primary-400' : isCompleted ? 'text-surface-300' : 'text-surface-500'
                    }`}>
                      {statusConfig[s]?.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-6 mt-6 pt-5 border-t border-white/5">
            {project.budget > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <HiCurrencyRupee className="w-4 h-4 text-emerald-400" />
                <span className="text-surface-400">Budget:</span>
                <span className="text-white font-semibold">₹{project.budget.toLocaleString()}</span>
              </div>
            )}
            {project.deadline && (
              <div className="flex items-center gap-2 text-sm">
                <HiCalendar className="w-4 h-4 text-amber-400" />
                <span className="text-surface-400">Deadline:</span>
                <span className="text-white font-semibold">{format(new Date(project.deadline), 'MMM d, yyyy')}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <HiClock className="w-4 h-4 text-blue-400" />
              <span className="text-surface-400">Created:</span>
              <span className="text-white font-semibold">{format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <HiUsers className="w-4 h-4 text-purple-400" />
              <span className="text-surface-400">Team:</span>
              <span className="text-white font-semibold">{project.assignedTeam?.length || 0} members</span>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-surface-900/50 rounded-xl p-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-primary-500/20 text-primary-300'
                  : 'text-surface-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab === 'chat' && <HiChat className="inline w-4 h-4 mr-1" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Requirements */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <HiClipboardList className="w-5 h-5 text-primary-400" />
                  Requirements
                </h3>
                <p className="text-surface-300 text-sm whitespace-pre-wrap leading-relaxed">{project.requirements}</p>
              </div>

              {/* Official Proposal */}
              {project.proposal?.sentAt && !project.proposal.isAccepted && (
                <div className="glass-card p-6 border-indigo-500/40 col-span-1 lg:col-span-2 bg-indigo-500/5">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <HiDocumentDownload className="w-6 h-6 text-indigo-400" />
                    Official Proposal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div className="p-4 bg-surface-900 rounded-xl border border-white/5">
                        <p className="text-surface-400 text-xs mb-2">Message from Admin</p>
                        <p className="text-surface-200 text-sm whitespace-pre-wrap">{project.proposal.message}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-surface-900 rounded-xl border border-white/5 text-center">
                        <p className="text-surface-400 text-xs mb-1">Final Price</p>
                        <p className="text-2xl font-bold text-emerald-400">${project.proposal.price?.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-surface-900 rounded-xl border border-white/5 text-center">
                        <p className="text-surface-400 text-xs mb-1">Estimated Timeline</p>
                        <p className="text-lg font-bold text-blue-400">{project.proposal.timeline}</p>
                      </div>
                      <Link 
                        to={`/checkout?projectId=${project._id}&amount=${project.proposal.price}`}
                        className="btn-primary w-full flex justify-center py-3 text-sm font-bold"
                      >
                        Accept & Pay
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Estimate */}
              {project.aiEstimate?.scopeSummary && (
                <div className="glass-card p-6 border-primary-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-lg">✨</span>
                    AI Scope Estimate
                  </h3>
                  <p className="text-surface-300 text-sm mb-4">{project.aiEstimate.scopeSummary}</p>
                  <div className="flex gap-4">
                    {project.aiEstimate.estimatedCost && (
                      <div className="bg-surface-800/50 rounded-lg px-4 py-3 flex-1">
                        <p className="text-xs text-surface-400">Est. Cost</p>
                        <p className="text-lg font-bold text-emerald-400">₹{project.aiEstimate.estimatedCost.toLocaleString()}</p>
                      </div>
                    )}
                    {project.aiEstimate.estimatedDays && (
                      <div className="bg-surface-800/50 rounded-lg px-4 py-3 flex-1">
                        <p className="text-xs text-surface-400">Est. Duration</p>
                        <p className="text-lg font-bold text-blue-400">{project.aiEstimate.estimatedDays} days</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Project Milestones</h3>
              <Timeline milestones={project.milestones} />
            </div>
          )}

          {activeTab === 'team' && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <HiUsers className="w-5 h-5 text-purple-400" />
                Assigned Team
              </h3>
              {project.assignedTeam?.length === 0 ? (
                <div className="py-8 text-center">
                  <HiUsers className="w-10 h-10 text-surface-600 mx-auto mb-2" />
                  <p className="text-surface-400">No team members assigned yet.</p>
                  <p className="text-xs text-surface-500 mt-1">A team will be assigned once your project is approved.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.assignedTeam?.map((member) => (
                    <div key={member._id} className="flex items-center gap-3 bg-surface-800/50 rounded-xl p-4 border border-white/5">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                        {member.user?.avatar ? (
                          <img src={member.user.avatar} alt={member.user.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          member.user?.name?.charAt(0) || 'T'
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{member.user?.name || 'Team Member'}</p>
                        <p className="text-xs text-surface-400 capitalize">{member.role || 'Developer'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'files' && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <HiDocumentDownload className="w-5 h-5 text-emerald-400" />
                Files & Deliverables
              </h3>
              {project.files?.length === 0 ? (
                <div className="py-8 text-center">
                  <HiPhotograph className="w-10 h-10 text-surface-600 mx-auto mb-2" />
                  <p className="text-surface-400">No files uploaded yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.files?.map((fileUrl, i) => {
                    const fileName = fileUrl.split('/').pop() || `File ${i + 1}`;
                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
                    return (
                      <a
                        key={i}
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-surface-800/50 rounded-xl p-4 border border-white/5 hover:border-primary-500/30 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                          {isImage ? (
                            <HiPhotograph className="w-5 h-5 text-primary-400" />
                          ) : (
                            <HiDocumentDownload className="w-5 h-5 text-emerald-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-surface-300 group-hover:text-white truncate transition-colors">{fileName}</p>
                          <p className="text-xs text-surface-500">Click to download</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <ChatWidget projectId={project._id} />
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ProjectDetail;
