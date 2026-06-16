import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectById } from '../../redux/slices/projectSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { 
  HiArrowLeft, HiOutlineDocumentText, HiOutlineCurrencyDollar, 
  HiOutlineCalendar, HiPaperAirplane 
} from 'react-icons/hi';

const AdminProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProject: project, loading } = useSelector((state) => state.project);
  
  const [proposalData, setProposalData] = useState({
    price: '',
    timeline: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    dispatch(fetchProjectById(id));
  }, [dispatch, id]);

  const handleSendProposal = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.put(`/projects/${id}/proposal`, {
        price: Number(proposalData.price),
        timeline: proposalData.timeline,
        message: proposalData.message
      });
      toast.success('Proposal sent successfully!');
      dispatch(fetchProjectById(id)); // Refresh project data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send proposal');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-surface-400">Loading project...</div>;
  if (!project) return <div className="p-12 text-center text-surface-400">Project not found</div>;

  return (
    <>
      <Helmet>
        <title>{project.title} — Admin | TechNova</title>
      </Helmet>

      <div className="space-y-6">
        <button onClick={() => navigate('/admin/projects')} className="text-surface-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
          <HiArrowLeft className="w-4 h-4" /> Back to Projects
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Client Requirements */}
          <div className="w-full md:w-2/3 space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-display font-bold text-white">{project.title}</h1>
                  <p className="text-primary-400 font-medium text-sm mt-1">{project.service?.title}</p>
                </div>
                <span className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border text-blue-400 bg-blue-500/10 border-blue-500/20">
                  {project.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-surface-900 border border-white/5">
                  <p className="text-surface-400 text-xs mb-1">Client Budget</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <HiOutlineCurrencyDollar className="text-primary-400" /> ${project.budget?.toLocaleString() || 'Not specified'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface-900 border border-white/5">
                  <p className="text-surface-400 text-xs mb-1">Client Deadline</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <HiOutlineCalendar className="text-primary-400" /> {project.deadline ? format(new Date(project.deadline), 'MMM d, yyyy') : 'Flexible'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <HiOutlineDocumentText className="text-primary-400" /> Requirements
                </h3>
                <div className="p-4 rounded-xl bg-surface-900 border border-white/5 text-surface-300 text-sm whitespace-pre-wrap">
                  {project.requirements}
                </div>
              </div>

              {project.files?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-white mb-3">Attached Files</h3>
                  <div className="flex flex-wrap gap-3">
                    {project.files.map((file, idx) => (
                      <a key={idx} href={file} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg bg-surface-900 border border-white/5 text-sm text-primary-400 hover:text-primary-300 transition-colors">
                        Attachment {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {project.proposal?.sentAt && (
              <div className="glass-card p-6 border-primary-500/20">
                <h2 className="text-lg font-bold text-white mb-4">Sent Proposal Details</h2>
                <div className="space-y-4 text-sm text-surface-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-surface-900 rounded-lg">
                      <p className="text-surface-400 text-xs mb-1">Proposed Price</p>
                      <p className="text-white font-bold text-lg">${project.proposal.price?.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-surface-900 rounded-lg">
                      <p className="text-surface-400 text-xs mb-1">Estimated Timeline</p>
                      <p className="text-white font-medium">{project.proposal.timeline}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-surface-900 rounded-lg border border-white/5">
                    <p className="text-surface-400 text-xs mb-2">Message to Client</p>
                    <p className="whitespace-pre-wrap">{project.proposal.message}</p>
                  </div>
                  <div className="flex justify-between items-center text-xs text-surface-400 pt-2">
                    <p>Sent on: {format(new Date(project.proposal.sentAt), 'PPp')}</p>
                    <p className={`font-bold ${project.proposal.isAccepted ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {project.proposal.isAccepted ? 'Accepted by Client' : 'Awaiting Client Approval'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Proposal Form or Client Info */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Client Details</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold">
                  {project.client?.name?.charAt(0) || 'C'}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{project.client?.name}</p>
                  <p className="text-xs text-surface-400">{project.client?.email}</p>
                </div>
              </div>
            </div>

            {project.status === 'new' || project.status === 'in_review' ? (
              <div className="glass-card p-6 border-primary-500/30">
                <h3 className="text-lg font-bold text-white mb-2">Draft Proposal</h3>
                <p className="text-xs text-surface-400 mb-6">Send an official quote and timeline to the client based on their requirements.</p>
                
                <form onSubmit={handleSendProposal} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-surface-300 mb-1">Final Price ($)</label>
                    <input 
                      type="number" 
                      required 
                      value={proposalData.price}
                      onChange={e => setProposalData({...proposalData, price: e.target.value})}
                      className="input-field" 
                      placeholder="e.g. 5000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-300 mb-1">Estimated Timeline</label>
                    <input 
                      type="text" 
                      required 
                      value={proposalData.timeline}
                      onChange={e => setProposalData({...proposalData, timeline: e.target.value})}
                      className="input-field" 
                      placeholder="e.g. 3-4 Weeks"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-300 mb-1">Advice / Message</label>
                    <textarea 
                      required 
                      rows="4"
                      value={proposalData.message}
                      onChange={e => setProposalData({...proposalData, message: e.target.value})}
                      className="input-field text-sm" 
                      placeholder="Detail what is included..."
                    />
                  </div>
                  <button type="submit" disabled={sending} className="btn-primary w-full flex justify-center items-center gap-2">
                    {sending ? 'Sending...' : <><HiPaperAirplane className="-rotate-45" /> Send Proposal</>}
                  </button>
                </form>
              </div>
            ) : null}

          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProjectDetail;
