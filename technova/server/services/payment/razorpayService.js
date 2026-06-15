import Razorpay from 'razorpay';
import crypto from 'crypto';

// In a real app, initialize with API keys from environment
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// Mock Razorpay instance for sandbox/development
export const createOrder = async (amount, currency = 'INR', receiptId) => {
  if (process.env.NODE_ENV === 'production' && process.env.RAZORPAY_KEY_ID) {
    /* Real implementation
    return await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency,
      receipt: receiptId,
    });
    */
  }
  
  // Mock Implementation
  return {
    id: `order_mock_${crypto.randomBytes(8).toString('hex')}`,
    entity: 'order',
    amount: amount * 100,
    amount_paid: 0,
    amount_due: amount * 100,
    currency,
    receipt: receiptId,
    status: 'created',
    attempts: 0,
    created_at: Math.floor(Date.now() / 1000),
  };
};

export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  if (process.env.NODE_ENV === 'production' && process.env.RAZORPAY_KEY_SECRET) {
    /* Real implementation
    const text = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');
    return expectedSignature === signature;
    */
  }
  
  // Mock Implementation
  return true; // Always return true in sandbox mode
};
