import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { HiDocumentText, HiCheckCircle, HiClock } from 'react-icons/hi';
import { fetchMyContracts, signContract } from '../../redux/slices/contractSlice';
import { format } from 'date-fns';

const Contracts = () => {
  const dispatch = useDispatch();
  const { contracts, loading } = useSelector((state) => state.contract);

  useEffect(() => {
    dispatch(fetchMyContracts());
  }, [dispatch]);

  const handleSign = (id) => {
    // In reality this would redirect to DocuSign
    // Here we just mock it for the demo
    dispatch(signContract(id));
  };

  return (
    <>
      <Helmet>
        <title>My Contracts — Tarkko Solutions</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Contracts & Agreements</h1>
          <p className="text-surface-400 mt-1">Manage and sign your project contracts.</p>
        </div>

        {loading ? (
          <div className="text-surface-400">Loading contracts...</div>
        ) : contracts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <HiDocumentText className="w-12 h-12 text-surface-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-1">No Contracts Yet</h3>
            <p className="text-surface-400 text-sm">Contracts will appear here when an admin generates them for your projects.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {contracts.map((contract) => (
              <div key={contract._id} className="glass-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${contract.status === 'signed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary-500/10 text-primary-400'}`}>
                    <HiDocumentText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Project: {contract.project?.title}</h3>
                    <p className="text-sm text-surface-400 mt-0.5">Created: {format(new Date(contract.createdAt), 'MMM d, yyyy')}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        contract.status === 'signed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        contract.status === 'sent' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-surface-800 text-surface-300 border-surface-700'
                      }`}>
                        {contract.status === 'signed' && <HiCheckCircle className="w-3 h-3" />}
                        {contract.status === 'sent' && <HiClock className="w-3 h-3" />}
                        {contract.status.toUpperCase()}
                      </span>
                      {contract.signedAt && (
                        <span className="text-xs text-surface-500">
                          Signed on {format(new Date(contract.signedAt), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {contract.status === 'sent' && contract.pdfUrl && (
                    <button 
                      onClick={() => handleSign(contract._id)}
                      className="btn-primary py-2 px-4 text-sm font-medium"
                    >
                      Sign Now
                    </button>
                  )}
                  {contract.status === 'signed' && (
                    <button className="btn-secondary py-2 px-4 text-sm font-medium opacity-50 cursor-not-allowed">
                      Signed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Contracts;
