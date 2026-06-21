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
  HiOutlineCalendar, HiPaperAirplane, HiRefresh, HiLightningBolt, HiUserGroup, HiOutlineVideoCamera
} from 'react-icons/hi';

const projectStatuses = [
  { value: 'new', label: 'New' },
  { value: 'in_review', label: 'In Review' },
  { value: 'proposal_sent', label: 'Proposal Sent' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

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
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [suggestingTeam, setSuggestingTeam] = useState(false);
  const [teamSuggestion, setTeamSuggestion] = useState(null);
  const [schedulingMeeting, setSchedulingMeeting] = useState(false);
  const [summarizingMeeting, setSummarizingMeeting] = useState(null);
  
  // Phase 6: Partner Assignment
  const [assignmentMode, setAssignmentMode] = useState('internal');
  const [matchingPartners, setMatchingPartners] = useState(false);
  const [partnerMatches, setPartnerMatches] = useState(null);

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
      dispatch(fetchProjectById(id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send proposal');
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (newStatus === project.status) return;
    setUpdatingStatus(true);
    try {
      await api.put(`/projects/${id}/admin`, { status: newStatus });
      toast.success('Project status updated!');
      dispatch(fetchProjectById(id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSuggestTeam = async () => {
    setSuggestingTeam(true);
    try {
      const response = await api.get(`/admin/projects/${id}/suggest-team`);
      setTeamSuggestion(response.data.data);
      toast.success('AI Team Suggestion generated!');
    } catch (error) {
      toast.error('Failed to get team suggestion');
    } finally {
      setSuggestingTeam(false);
    }
  };

  const handleMatchPartners = async () => {
    setMatchingPartners(true);
    try {
      const response = await api.get(`/projects/${id}/match-partners`);
      setPartnerMatches(response.data.data);
      toast.success('AI Partner Matches generated!');
    } catch (error) {
      toast.error('Failed to get partner matches');
    } finally {
      setMatchingPartners(false);
    }
  };

  const handleAssignPartner = async (partnerId) => {
    try {
      await api.put(`/projects/${id}/admin`, { assignedPartner: partnerId, assignedTeam: [] });
      toast.success('Project assigned to Partner!');
      dispatch(fetchProjectById(id));
    } catch (error) {
      toast.error('Failed to assign partner');
    }
  };

  const handleScheduleMeeting = async () => {
    const meetLink = window.prompt("Enter the real Google Meet link (e.g. https://meet.google.com/abc-defg-hij):", "");
    if (!meetLink) {
      toast.error('Meeting scheduling cancelled. A valid Google Meet link is required.');
      return;
    }

    const title = window.prompt("Enter meeting title:", "Project Sync");
    if (!title) return;

    setSchedulingMeeting(true);
    try {
      await api.post(`/projects/${id}/meetings`, {
        title,
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        meetLink
      });
      toast.success('Meeting Scheduled!');
      dispatch(fetchProjectById(id));
    } catch (error) {
      toast.error('Failed to schedule meeting');
    } finally {
      setSchedulingMeeting(false);
    }
  };

  const handleSummarizeMeeting = async (meetingId) => {
    const transcript = window.prompt("Paste the meeting transcript text here to summarize:", "John: Let's finalize the escrow feature.\nSarah: Agreed, it will take 1 week.");
    if (!transcript) return;

    setSummarizingMeeting(meetingId);
    try {
      await api.post(`/projects/${id}/meetings/${meetingId}/summarize`, { textTranscript: transcript });
      toast.success('Meeting Summarized with AI!');
      dispatch(fetchProjectById(id));
    } catch (error) {
      toast.error('Failed to summarize meeting');
    } finally {
      setSummarizingMeeting(null);
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
        <button onClick={() => navigate('/admin/projects')} className="text-surface-400 hover:text-white flex items-center gap-2 text-sm transition-colors w-fit">
          <HiArrowLeft className="w-4 h-4" /> Back to Projects
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Client Requirements */}
          <div className="w-full md:w-2/3 space-y-6">
            <div className="glass-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-display font-bold text-white">{project.title}</h1>
                    {project.riskScore !== null && project.riskScore !== undefined && (
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        project.riskScore > 70 ? 'bg-red-500/20 text-red-400' :
                        project.riskScore > 30 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        Risk Score: {project.riskScore}
                      </span>
                    )}
                  </div>
                  <p className="text-primary-400 font-medium text-sm mt-1">{project.service?.title}</p>
                </div>
                
                <div className="flex items-center gap-2 bg-surface-900 border border-white/10 rounded-lg p-1.5 pl-3">
                  <span className="text-xs text-surface-400 font-medium whitespace-nowrap">Status:</span>
                  <select
                    disabled={updatingStatus}
                    value={project.status}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    className="bg-transparent text-sm text-white focus:outline-none cursor-pointer appearance-none pr-8 py-1"
                  >
                    {projectStatuses.map(s => (
                      <option key={s.value} value={s.value} className="bg-surface-800 text-white">
                        {s.label}
                      </option>
                    ))}
                  </select>
                  {updatingStatus && <HiRefresh className="w-4 h-4 text-primary-500 animate-spin mr-2" />}
                </div>
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
                    <div className="p-3 bg-surface-900 rounded-lg border border-white/5">
                      <p className="text-surface-400 text-xs mb-1">Proposed Price</p>
                      <p className="text-white font-bold text-lg">${project.proposal.price?.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-surface-900 rounded-lg border border-white/5">
                      <p className="text-surface-400 text-xs mb-1">Estimated Timeline</p>
                      <p className="text-white font-medium">{project.proposal.timeline}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-surface-900 rounded-lg border border-white/5">
                    <p className="text-surface-400 text-xs mb-2">Message to Client</p>
                    <p className="whitespace-pre-wrap">{project.proposal.message}</p>
                  </div>
                  <div className="flex justify-between items-center text-xs text-surface-400 pt-2 border-t border-white/5 mt-4">
                    <p>Sent on: {format(new Date(project.proposal.sentAt), 'PPp')}</p>
                    <p className={`font-bold uppercase tracking-wider px-2 py-1 rounded-full ${project.proposal.isAccepted ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
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

            <div className="glass-card p-6 border-primary-500/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <HiUserGroup className="text-primary-400" /> Assignment Mode
                </h3>
              </div>

              {/* Toggle Tab */}
              <div className="flex p-1 bg-surface-900 rounded-lg mb-4 border border-white/5">
                <button 
                  onClick={() => setAssignmentMode('internal')} 
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${assignmentMode === 'internal' ? 'bg-primary-500 text-white' : 'text-surface-400 hover:text-white'}`}
                >
                  Internal Team
                </button>
                <button 
                  onClick={() => setAssignmentMode('partner')} 
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${assignmentMode === 'partner' ? 'bg-primary-500 text-white' : 'text-surface-400 hover:text-white'}`}
                >
                  Partner Network
                </button>
              </div>
              
              {assignmentMode === 'internal' ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-surface-400">Internal Agency Staff</p>
                    <button 
                      onClick={handleSuggestTeam}
                      disabled={suggestingTeam}
                      className="text-xs bg-primary-600 hover:bg-primary-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      {suggestingTeam ? <HiRefresh className="animate-spin" /> : <HiLightningBolt />}
                      Suggest Team
                    </button>
                  </div>
                  
                  {teamSuggestion && (
                    <div className="bg-primary-900/40 border border-primary-500/30 rounded-lg p-3 mb-4">
                      <p className="text-xs font-bold text-primary-300 mb-1 flex items-center gap-1"><HiLightningBolt /> AI Suggestion</p>
                      <p className="text-xs text-surface-200">{teamSuggestion.reasoning}</p>
                      <div className="mt-2 text-xs text-primary-400 font-medium">Suggested IDs: {teamSuggestion.suggestedTeam.join(', ')}</div>
                    </div>
                  )}
                  
                  {project.assignedTeam?.length > 0 ? (
                    <div className="space-y-2">
                      {project.assignedTeam.map((member, idx) => (
                        <div key={idx} className="text-sm text-surface-300 bg-surface-900 p-2 rounded border border-white/5">
                          {member.user?.name || member._id}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-surface-400">No team members assigned yet.</p>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-surface-400">External Marketplace Partners</p>
                    <button 
                      onClick={handleMatchPartners}
                      disabled={matchingPartners}
                      className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      {matchingPartners ? <HiRefresh className="animate-spin" /> : <HiLightningBolt />}
                      Match Partners
                    </button>
                  </div>

                  {project.assignedPartner ? (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mb-4">
                      <p className="text-xs text-emerald-400 font-bold mb-1">Assigned Partner</p>
                      <p className="text-sm text-white">{project.assignedPartner.user?.name || 'Partner'}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-surface-400 mb-4">No partner assigned.</p>
                  )}

                  {partnerMatches && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-primary-300 mb-2 flex items-center gap-1"><HiLightningBolt /> AI Partner Matches</p>
                      {partnerMatches.map(match => (
                        <div key={match._id} className="bg-surface-900 border border-white/5 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-sm font-bold text-white">{match.user?.name || 'Partner'}</p>
                              <p className="text-[10px] text-surface-400 uppercase">{match.type}</p>
                            </div>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{match.matchScore}% Match</span>
                          </div>
                          <p className="text-xs text-surface-300 mb-3">{match.reasoning}</p>
                          <button onClick={() => handleAssignPartner(match._id)} className="w-full text-xs font-bold bg-white/5 hover:bg-white/10 text-white py-1.5 rounded transition-colors">
                            Assign Partner
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="glass-card p-6 border-primary-500/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <HiOutlineVideoCamera className="text-primary-400" /> Google Meets
                </h3>
                <button 
                  onClick={handleScheduleMeeting}
                  disabled={schedulingMeeting}
                  className="text-xs bg-primary-600 hover:bg-primary-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  {schedulingMeeting ? <HiRefresh className="animate-spin" /> : 'Schedule'}
                </button>
              </div>
              
              {project.meetings?.length > 0 ? (
                <div className="space-y-3">
                  {project.meetings.map(m => (
                    <div key={m._id} className="bg-surface-900 border border-white/5 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-bold text-white">{m.title}</p>
                          <p className="text-[10px] text-surface-400">{format(new Date(m.date), 'PPp')}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${m.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {m.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <a href={m.meetLink} target="_blank" rel="noreferrer" className="text-xs bg-surface-800 hover:bg-surface-700 text-white px-2 py-1 rounded transition-colors">
                          Join Meet
                        </a>
                        {m.status === 'scheduled' && (
                          <button 
                            onClick={() => handleSummarizeMeeting(m._id)}
                            disabled={summarizingMeeting === m._id}
                            className="text-xs text-primary-400 hover:text-primary-300 bg-primary-500/10 px-2 py-1 rounded transition-colors"
                          >
                            {summarizingMeeting === m._id ? 'Generating...' : 'AI Summary'}
                          </button>
                        )}
                      </div>

                      {m.summary && (
                        <div className="mt-3 pt-3 border-t border-white/5">
                          <p className="text-xs text-surface-300 leading-relaxed mb-2">{m.summary}</p>
                          {m.actionItems?.length > 0 && (
                            <ul className="text-xs text-primary-400 list-disc pl-4 space-y-1">
                              {m.actionItems.map((item, idx) => <li key={idx}>{item}</li>)}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-surface-400">No meetings scheduled.</p>
              )}
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
