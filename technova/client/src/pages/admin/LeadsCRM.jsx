import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllLeads, updateLeadStatus, communicateWithLead } from '../../redux/slices/adminSlice';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { format } from 'date-fns';
import { HiMail, HiChatAlt2, HiPaperAirplane, HiX, HiPlus, HiSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const leadStages = ['new', 'contacted', 'qualified', 'converted', 'lost'];

const LeadsCRM = () => {
  const dispatch = useDispatch();
  const { leads, loading } = useSelector((state) => state.admin || { leads: [], loading: false });
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [message, setMessage] = useState('');
  const [commType, setCommType] = useState('note'); // 'note' or 'email'
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    name: '', email: '', phone: '', company: '', requirement: '', source: 'referral'
  });

  const chatEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllLeads());
  }, [dispatch]);

  const selectedLead = leads.find(l => l._id === selectedLeadId);

  // Auto-scroll chat
  useEffect(() => {
    if (selectedLead && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedLead?.notes]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    dispatch(updateLeadStatus({ leadId: draggableId, status: destination.droppableId }));
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await dispatch(communicateWithLead({ leadId: selectedLeadId, type: commType, message })).unwrap();
      setMessage('');
      toast.success(commType === 'email' ? 'Email sent successfully!' : 'Note added!');
    } catch (err) {
      toast.error(err || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leads', newLeadForm);
      toast.success('Lead added successfully!');
      setShowAddModal(false);
      setNewLeadForm({ name: '', email: '', phone: '', company: '', requirement: '', source: 'referral' });
      dispatch(fetchAllLeads());
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add lead');
    }
  };

  const getFilteredLeads = () => {
    if (!searchQuery.trim()) return leads;
    const query = searchQuery.toLowerCase();
    return leads.filter(l => 
      l.name?.toLowerCase().includes(query) || 
      l.email?.toLowerCase().includes(query) || 
      l.company?.toLowerCase().includes(query)
    );
  };

  const filteredLeads = getFilteredLeads();
  const getLeadsByStage = (stage) => filteredLeads.filter(l => l.status === stage);

  return (
    <>
      <Helmet>
        <title>Leads CRM — TechNova</title>
      </Helmet>

      <div className="h-full flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Leads Pipeline</h1>
            <p className="text-surface-400 text-sm mt-1">Manage prospects and track conversions.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search leads..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-900 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>
            <button onClick={() => setShowAddModal(true)} className="btn-primary whitespace-nowrap flex items-center gap-2">
              <HiPlus className="w-5 h-5"/> Add Lead
            </button>
          </div>
        </div>

        {loading && leads.length === 0 ? (
          <div className="p-12 text-center text-surface-400">Loading pipeline...</div>
        ) : (
          <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-140px)]">
            
            {/* Kanban Board */}
            <div className={`flex-1 flex gap-4 overflow-x-auto pb-4 items-start ${selectedLead ? 'xl:w-2/3' : 'w-full'}`}>
              <DragDropContext onDragEnd={onDragEnd}>
                {leadStages.map((stage) => {
                  const stageLeads = getLeadsByStage(stage);
                  return (
                    <div key={stage} className="w-72 flex-shrink-0 flex flex-col bg-surface-900/40 rounded-xl border border-white/5 h-full max-h-full">
                      <div className="p-4 border-b border-white/5 font-semibold text-white uppercase text-[11px] tracking-wider flex justify-between items-center sticky top-0 bg-surface-900/80 backdrop-blur-md z-10 rounded-t-xl">
                        {stage}
                        <span className="bg-surface-800/80 px-2 py-0.5 rounded-full text-surface-300 font-mono">
                          {stageLeads.length}
                        </span>
                      </div>
                      
                      <Droppable droppableId={stage}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`p-3 flex-1 overflow-y-auto min-h-[150px] space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-white/[0.02]' : ''}`}
                          >
                            {stageLeads.map((lead, index) => (
                              <Draggable key={lead._id} draggableId={lead._id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    onClick={() => setSelectedLeadId(lead._id)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                      selectedLeadId === lead._id ? 'bg-surface-800 border-primary-500 shadow-lg shadow-primary-500/20' :
                                      snapshot.isDragging ? 'bg-surface-800 border-primary-500/50 scale-[1.02] z-50' : 'bg-surface-900 border-white/10 hover:border-white/20'
                                    }`}
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-medium text-white text-sm leading-tight max-w-[80%] truncate">{lead.name}</h4>
                                      <div className="flex items-center gap-1">
                                        {lead.score > 0 && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono">{lead.score}</span>}
                                        {lead.notes?.length > 0 && <span className="w-2 h-2 rounded-full bg-accent-500 ml-1"></span>}
                                      </div>
                                    </div>
                                    <p className="text-xs text-surface-400 line-clamp-2 mb-3 leading-relaxed">{lead.requirement || 'No details provided'}</p>
                                    
                                    <div className="flex items-center justify-between text-[10px] text-surface-500">
                                      <span className="truncate max-w-[90px]">{lead.company || lead.email}</span>
                                      <div className="flex items-center gap-2">
                                        <span className="bg-surface-800 px-1.5 py-0.5 rounded capitalize">{lead.source}</span>
                                        <span>{format(new Date(lead.createdAt), 'MMM d')}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </DragDropContext>
            </div>

            {/* Communication Panel (WhatsApp Style) */}
            {selectedLead && (
              <div className="xl:w-1/3 w-full bg-surface-900 rounded-xl border border-white/10 flex flex-col h-full max-h-[600px] xl:max-h-full shrink-0">
                {/* Header */}
                <div className="p-4 border-b border-white/10 bg-surface-800 rounded-t-xl flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-bold">{selectedLead.name}</h3>
                    <p className="text-xs text-surface-400 mb-1">{selectedLead.email} {selectedLead.phone ? `• ${selectedLead.phone}` : ''}</p>
                    <div className="flex gap-2 items-center mt-1">
                      <span className="text-[10px] bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full uppercase tracking-wider">{selectedLead.status}</span>
                      <span className="text-[10px] bg-surface-700 text-surface-300 px-2 py-0.5 rounded-full capitalize">Src: {selectedLead.source}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedLeadId(null)} className="p-1 hover:bg-white/10 rounded-lg text-surface-400">
                    <HiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-surface-950/50">
                  <div className="bg-surface-800 p-3 rounded-xl rounded-tl-sm border border-white/5 w-11/12">
                    <span className="text-[10px] text-primary-400 block mb-1">Initial Request</span>
                    <p className="text-sm text-surface-200">{selectedLead.requirement || 'No initial requirement provided.'}</p>
                    <span className="text-[9px] text-surface-500 mt-2 block text-right">{format(new Date(selectedLead.createdAt), 'MMM d, h:mm a')}</span>
                  </div>

                  {selectedLead.notes?.map((note, idx) => (
                    <div key={idx} className="bg-primary-900/40 p-3 rounded-xl rounded-tr-sm border border-primary-500/20 w-11/12 ml-auto">
                      <span className="text-[10px] text-accent-400 flex items-center gap-1 mb-1">
                        {note.isEmail ? <><HiMail className="w-3 h-3"/> Sent via Email</> : <><HiChatAlt2 className="w-3 h-3"/> Internal Note</>}
                      </span>
                      <p className="text-sm text-surface-200 whitespace-pre-wrap">{note.text}</p>
                      <span className="text-[9px] text-surface-500 mt-2 block text-right">
                        {format(new Date(note.createdAt), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-white/10 bg-surface-800 rounded-b-xl">
                  <div className="flex gap-2 mb-2">
                    <button 
                      onClick={() => setCommType('note')} 
                      className={`text-xs px-3 py-1 rounded-full transition-colors ${commType === 'note' ? 'bg-surface-600 text-white' : 'text-surface-400 hover:bg-surface-700'}`}
                    >
                      Internal Note
                    </button>
                    <button 
                      onClick={() => setCommType('email')} 
                      className={`text-xs px-3 py-1 rounded-full transition-colors ${commType === 'email' ? 'bg-primary-600 text-white' : 'text-surface-400 hover:bg-surface-700'}`}
                    >
                      Send Email
                    </button>
                  </div>
                  <div className="flex items-end gap-2">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={commType === 'email' ? 'Draft email to client...' : 'Add an internal note...'}
                      className="flex-1 bg-surface-900 border border-white/10 rounded-xl p-3 text-sm text-white resize-none focus:outline-none focus:border-primary-500"
                      rows="3"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={sending || !message.trim()}
                      className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white p-3 rounded-xl transition-colors flex-shrink-0 mb-1"
                    >
                      <HiPaperAirplane className="w-5 h-5 transform rotate-90" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="bg-surface-900 border border-white/10 rounded-3xl p-6 w-full max-w-lg relative z-10 shadow-2xl">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-surface-400 hover:text-white">
              <HiX className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Add New Lead</h2>
            
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Name</label>
                  <input required type="text" value={newLeadForm.name} onChange={e => setNewLeadForm({...newLeadForm, name: e.target.value})} className="input-field" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Email</label>
                  <input required type="email" value={newLeadForm.email} onChange={e => setNewLeadForm({...newLeadForm, email: e.target.value})} className="input-field" placeholder="john@example.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Phone</label>
                  <input type="text" value={newLeadForm.phone} onChange={e => setNewLeadForm({...newLeadForm, phone: e.target.value})} className="input-field" placeholder="+1 234 567 890" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1">Company</label>
                  <input type="text" value={newLeadForm.company} onChange={e => setNewLeadForm({...newLeadForm, company: e.target.value})} className="input-field" placeholder="Acme Corp" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1">Source</label>
                <select value={newLeadForm.source} onChange={e => setNewLeadForm({...newLeadForm, source: e.target.value})} className="input-field">
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="ads">Ads</option>
                  <option value="contact_form">Contact Form</option>
                  <option value="chatbot">Chatbot</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1">Requirement / Notes</label>
                <textarea required value={newLeadForm.requirement} onChange={e => setNewLeadForm({...newLeadForm, requirement: e.target.value})} rows="3" className="input-field resize-none" placeholder="What are they looking for?"></textarea>
              </div>
              
              <button type="submit" className="btn-primary w-full py-3 mt-2">Create Lead</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LeadsCRM;
