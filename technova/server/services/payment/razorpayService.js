import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: (process.env.RAZORPAY_KEY_ID || 'rzp_test_T4FMQmvKwnT7c2').trim(),
  key_secret: (process.env.RAZORPAY_KEY_SECRET || '5WMV9fVfyRWTZKA1tX0KGmlW').trim(),
});

// Mock Razorpay instance for sandbox/development
export const createOrder = async (amount, currency = 'INR', receiptId) => {
  if (process.env.RAZORPAY_KEY_ID) {
    try {
      return await razorpay.orders.create({
        amount: amount * 100, // in paise
        currency,
        receipt: receiptId,
      });
    } catch (err) {
      console.error('Razorpay Order Error:', err);
      throw err;
    }
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
  if (process.env.RAZORPAY_KEY_SECRET) {
    const text = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', (process.env.RAZORPAY_KEY_SECRET || '5WMV9fVfyRWTZKA1tX0KGmlW').trim())
      .update(text)
      .digest('hex');
    return expectedSignature === signature;
  }
  
  // Mock Implementation
  return true; // Always return true in sandbox mode
};

export const createPlan = async (amount, currency = 'INR', interval = 'monthly', name = 'Service Plan') => {
  if (process.env.RAZORPAY_KEY_ID) {
    try {
      return await razorpay.plans.create({
        period: interval,
        interval: 1,
        item: {
          name,
          amount: amount * 100,
          currency,
          description: 'Monthly service retainer',
        }
      });
    } catch (err) {
      console.error('Razorpay Plan Error:', err);
      throw err;
    }
  }

  // Mock Implementation
  return {
    id: `plan_mock_${crypto.randomBytes(8).toString('hex')}`,
    entity: 'plan',
    item: {
      name,
      amount: amount * 100,
      currency,
      description: 'Monthly service retainer',
    },
    period: interval,
    interval: 1,
  };
};

export const createSubscription = async (planId, customerEmail) => {
  if (process.env.RAZORPAY_KEY_ID) {
    try {
      return await razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        total_count: 120, // 10 years
      });
    } catch (err) {
      console.error('Razorpay Subscription Error:', err);
      throw err;
    }
  }

  // Mock Implementation
  return {
    id: `sub_mock_${crypto.randomBytes(8).toString('hex')}`,
    entity: 'subscription',
    plan_id: planId,
    customer_notify: 1,
    quantity: 1,
    total_count: 120, // 10 years
    status: 'created',
    short_url: 'https://rzp.io/i/mock_subscription_url',
  };
};
