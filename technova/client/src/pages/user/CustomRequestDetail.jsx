import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  HiArrowLeft, HiCalendar, HiCurrencyRupee, HiUsers,
  HiClipboardList, HiClock, HiOutlineSparkles,
  HiCheckCircle, HiExclamation, HiDocumentDownload
} from 'react-icons/hi';
import api from '../../services/api';

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: HiClock },
  in_review: { label: 'In Review', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: HiClipboardList },
  proposal_sent: { label: 'Proposal Sent', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icon: HiDocumentDownload },
  in_progress: { label: 'In Progress', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: HiExclamation },
  completed: { label: 'Completed', color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: HiCheckCircle },
};

const tabs = ['overview', 'milestones', 'meetings', 'team', 'files', 'design feedback', 'chat', 'escrow'];

const CustomRequestDetail = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await api.get(`/custom-requests/${id}`);
        setRequest(res.data.data);
      } catch (error) {
        console.error("Failed to fetch custom request", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  if (loading || !request) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-surface-400">Loading request details...</p>
        </div>
      </div>
    );
  }

  const getMappedStatus = (rawStatus) => {
    if (rawStatus === 'reviewed') return 'in_review';
    if (rawStatus === 'contacted') return 'proposal_sent';
    if (rawStatus === 'resolved') return 'completed';
    return 'new';
  };

  const mappedStatus = getMappedStatus(request.status);
  const status = statusConfig[mappedStatus] || statusConfig.new;
  const StatusIcon = status.icon;

  const allStatuses = ['new', 'in_review', 'proposal_sent', 'in_progress', 'completed'];
  const currentStep = allStatuses.indexOf(mappedStatus);

  return (
    <>
      <Helmet>
        <title>{request.serviceName} — Velixora</title>
      </Helmet>
      
      <div className="space-y-6">
        <Link to="/dashboard/projects" className="inline-flex items-center text-sm text-surface-400 hover:text-white transition-colors">
          <HiArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Projects
        </Link>

        {/* Warning Banner */}
        <div className="bg-primary-500/10 border border-primary-500/20 rounded-2xl p-4 flex gap-4">
          <HiOutlineSparkles className="w-6 h-6 text-primary-400 shrink-0" />
          <div>
            <h4 className="text-primary-300 font-bold mb-1">Custom Request Pending</h4>
            <p className="text-primary-400/80 text-sm">
              This is a pending Custom Request. It will be converted to a full project with Chat, Files, and Milestones once the Admin approves it and sends you a proposal.
            </p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-white">{request.serviceName}</h1>
              <p className="text-surface-400 text-sm mt-1">Custom Service Request</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${status.color}`}>
              <StatusIcon className="w-4 h-4" />
              {status.label}
            </span>
          </div>

          <div className="mt-6 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0">
            <div className="flex items-center justify-between min-w-[500px] sm:min-w-0">
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
                    <span className={`mt-2 text-[10px] sm:text-xs font-medium uppercase tracking-wider ${
                      isCurrent ? 'text-primary-400' : isCompleted ? 'text-surface-300' : 'text-surface-600'
                    }`}>
                      {statusConfig[s].label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center text-surface-400">
              <HiCalendar className="w-4 h-4 mr-2 text-surface-500" />
              <span className="font-medium mr-1">Requested:</span>
              {format(new Date(request.createdAt), 'MMM d, yyyy')}
            </div>
            <div className="flex items-center text-surface-400">
              <HiCurrencyRupee className="w-4 h-4 mr-2 text-surface-500" />
              <span className="font-medium mr-1">Budget:</span>
              {request.budget || 'Not specified'}
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide border-b border-white/5 pb-px mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab === 'overview'
                  ? 'border-primary-500 text-white bg-primary-500/5'
                  : 'border-transparent text-surface-400/50 cursor-not-allowed'
              }`}
              title={tab !== 'overview' ? 'This tab will be unlocked once the admin approves and converts this request to a project.' : ''}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <HiClipboardList className="text-primary-400" />
            Requirements
          </h3>
          <div className="text-surface-300 bg-surface-900/50 p-4 rounded-xl border border-white/5 whitespace-pre-wrap leading-relaxed">
            {request.description}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomRequestDetail;
