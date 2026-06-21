import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HiCreditCard, HiLockClosed, HiCheckCircle } from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const projectId = searchParams.get('projectId');
  const amount = Number(searchParams.get('amount') || 0);
  const currency = searchParams.get('currency') || 'INR';
  const pricingTier = searchParams.get('tier') || 'Custom';
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // We'll calculate mock exchange rate if it's not INR
  const exchangeRateAtPurchase = currency === 'INR' ? null : (currency === 'USD' ? 83.5 : 90);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await loadRazorpay();
      if (!res) {
        toast.error('Razorpay SDK failed to load');
        setLoading(false);
        return;
      }

      // 1. Create order
      const { data } = await api.post('/orders', {
        projectId,
        amount,
        currency,
        pricingTier,
        exchangeRateAtPurchase
      });
      
      const { order, paymentDetails } = data.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_T4FMQmvKwnT7c2',
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        name: 'Velixora',
        description: `Payment for ${pricingTier} tier`,
        order_id: paymentDetails.id,
        handler: async function (response) {
          try {
            await api.post(`/orders/${order._id}/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            setSuccess(true);
            toast.success('Payment Successful!');
            setTimeout(() => navigate('/dashboard/orders'), 2000);
          } catch (err) {
            toast.error(err.response?.data?.message || 'Payment verification failed');
            setLoading(false);
          }
        },
        prefill: {
          name: 'Client',
          email: 'client@velixora.com'
        },
        theme: { color: '#6c5ce7' },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        toast.error(response.error.description || 'Payment Failed');
        setLoading(false);
      });

      paymentObject.open();

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initiate checkout');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-12 text-center max-w-md w-full border-emerald-500/30">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiCheckCircle className="w-12 h-12 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Payment Verified</h2>
          <p className="text-surface-400 mb-6">Your order is confirmed and project has started!</p>
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Secure Checkout | TechNova</title>
      </Helmet>

      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20">
            <HiLockClosed className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">Secure Checkout</h1>
          <p className="text-surface-400 mt-2">Complete your payment securely to begin the project.</p>
        </div>

        <div className="glass-card p-8 border-primary-500/20">
          <div className="flex justify-between items-center mb-8 pb-8 border-b border-white/5">
            <div>
              <h3 className="text-lg font-bold text-white">Project Deposit</h3>
              <p className="text-surface-400 text-sm">{pricingTier} Tier</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-surface-500">Amount Due</span>
              <div className="text-3xl font-bold text-white tracking-tight">
                {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹'}
                {amount.toLocaleString()}
              </div>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={loading || !projectId}
            className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary-500/20"
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <HiCreditCard className="w-6 h-6" />
                Pay Now via Razorpay
              </>
            )}
          </button>
          
          <div className="mt-6 text-center flex items-center justify-center gap-2 text-xs text-surface-500">
            <HiLockClosed className="w-4 h-4" />
            256-bit SSL Encrypted Transaction
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
