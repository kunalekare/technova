import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllLeads, updateLeadStatus, communicateWithLead } from '../../redux/slices/adminSlice';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { format } from 'date-fns';
import { HiMail, HiChatAlt2, HiPaperAirplane, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

const leadStages = ['new', 'contacted', 'qualified', 'converted', 'lost'];

const LeadsCRM = () => {
  const dispatch = useDispatch();
  const { leads, loading } = useSelector((state) => state.admin || { leads: [], loading: false });
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [message, setMessage] = useState('');
  const [commType, setCommType] = useState('note'); // 'note' or 'email'
  const [sending, setSending] = useState(false);
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

  const getLeadsByStage = (stage) => leads.filter(l => l.status === stage);

  return (
    <>
      <Helmet>
        <title>Leads CRM — TechNova</title>
      </Helmet>

      <div className="h-full flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Leads Pipeline</h1>
          <p className="text-surface-400 text-sm mt-1">Drag and drop leads to update status. Click a lead to communicate.</p>
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
                                      <h4 className="font-medium text-white text-sm leading-tight">{lead.name}</h4>
                                      {lead.notes?.length > 0 && <span className="w-2 h-2 rounded-full bg-accent-500"></span>}
                                    </div>
                                    <p className="text-xs text-surface-400 line-clamp-2 mb-3 leading-relaxed">{lead.requirement || 'No details provided'}</p>
                                    
                                    <div className="flex items-center justify-between text-[10px] text-surface-500">
                                      <span className="truncate max-w-[120px]">{lead.company || lead.email}</span>
                                      <span>{format(new Date(lead.createdAt), 'MMM d')}</span>
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
                    <span className="text-[10px] bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full uppercase tracking-wider">{selectedLead.status}</span>
                  </div>
                  <button onClick={() => setSelectedLeadId(null)} className="p-1 hover:bg-white/10 rounded-lg text-surface-400">
                    <HiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-surface-950/50">
                  <div className="bg-surface-800 p-3 rounded-xl rounded-tl-sm border border-white/5 w-11/12">
                    <span className="text-[10px] text-primary-400 block mb-1">Initial Request</span>
                    <p className="text-sm text-surface-200">{selectedLead.requirement}</p>
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
    </>
  );
};

export default LeadsCRM;
