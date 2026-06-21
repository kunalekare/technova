import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { HiBadgeCheck, HiShieldExclamation, HiClock } from 'react-icons/hi';
import { fetchMyVerification, submitVerification } from '../../redux/slices/verificationSlice';

const Verification = () => {
  const dispatch = useDispatch();
  const { myVerification, loading } = useSelector((state) => state.verification);
  const [formData, setFormData] = useState({ gstNumber: '', companyName: '', documentUrl: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchMyVerification());
  }, [dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await dispatch(submitVerification(formData));
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Business Verification — Tarkko Solutions</title>
      </Helmet>

      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Business Verification</h1>
          <p className="text-surface-400 mt-1">Submit KYC documents to unlock enterprise-tier features.</p>
        </div>

        {loading ? (
          <div className="text-surface-400">Loading...</div>
        ) : myVerification && myVerification.status === 'verified' ? (
          <div className="glass-card p-8 border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-400">
                <HiBadgeCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-400">Verified Business Account</h3>
                <p className="text-surface-300 mt-1">Your business ({myVerification.companyName}) has been successfully verified.</p>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-surface-400 block">GST Number:</span>
                    <span className="text-white font-medium">{myVerification.gstNumber}</span>
                  </div>
                  <div>
                    <span className="text-surface-400 block">Status:</span>
                    <span className="text-emerald-400 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card p-6">
            {myVerification && myVerification.status === 'pending' && (
              <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-amber-400">
                <HiClock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Verification Pending</h4>
                  <p className="text-sm mt-1 opacity-90">We are currently reviewing your documents. This usually takes 24-48 hours. You can resubmit if you made a mistake.</p>
                </div>
              </div>
            )}
            {myVerification && myVerification.status === 'rejected' && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400">
                <HiShieldExclamation className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Verification Rejected</h4>
                  <p className="text-sm mt-1 opacity-90">There was an issue with your submitted documents. Please check the details and resubmit.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">Company Legal Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="e.g. Tarkko Solutions Pvt Ltd"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">GST Number / Tax ID</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="e.g. 22AAAAA0000A1Z5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">Document URL (Mock upload)</label>
                <input
                  type="url"
                  name="documentUrl"
                  value={formData.documentUrl}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://example.com/certificate.pdf"
                />
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-2.5 flex justify-center"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Verification;
