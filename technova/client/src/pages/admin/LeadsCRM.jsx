import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllLeads, updateLeadStatus } from '../../redux/slices/adminSlice';

const leadStages = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];

const LeadsCRM = () => {
  const dispatch = useDispatch();
  const { leads, loading } = useSelector((state) => state.admin || { leads: [], loading: false });

  useEffect(() => {
    dispatch(fetchAllLeads());
  }, [dispatch]);

  const getLeadsByStage = (stage) => leads.filter(l => l.status === stage);

  return (
    <>
      <Helmet>
        <title>Leads CRM — TechNova</title>
      </Helmet>

      <div className="h-full flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Leads Pipeline</h1>
          <p className="text-surface-400 text-sm">Drag and drop leads to update their status.</p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-surface-400">Loading pipeline...</div>
        ) : (
          <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
            {leadStages.map((stage) => (
              <div key={stage} className="w-80 flex-shrink-0 flex flex-col bg-surface-900/50 rounded-xl border border-white/5 h-full">
                <div className="p-4 border-b border-white/5 font-semibold text-white uppercase text-xs tracking-wider flex justify-between">
                  {stage}
                  <span className="bg-surface-800 px-2 py-0.5 rounded-full">{getLeadsByStage(stage).length}</span>
                </div>
                <div className="p-4 flex-1 overflow-y-auto space-y-3">
                  {getLeadsByStage(stage).map(lead => (
                    <div key={lead._id} className="glass-card p-4 cursor-grab active:cursor-grabbing hover:border-primary-500/50 transition-colors">
                      <h4 className="font-medium text-white text-sm mb-1">{lead.name}</h4>
                      <p className="text-xs text-surface-400 truncate mb-3">{lead.requirement}</p>
                      
                      {/* Simple dropdown to move stage if drag and drop isn't fully implemented */}
                      <select 
                        className="w-full bg-surface-950 border border-white/10 rounded-lg text-xs p-1.5 text-surface-300"
                        value={lead.status}
                        onChange={(e) => dispatch(updateLeadStatus({ leadId: lead._id, status: e.target.value }))}
                      >
                        {leadStages.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default LeadsCRM;
