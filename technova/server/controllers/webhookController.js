import Subscription from '../models/Subscription.js';
import Invoice from '../models/Invoice.js';
import Payment from '../models/Payment.js';
import Project from '../models/Project.js';
import Service from '../models/Service.js';
import crypto from 'crypto';

// @desc    Handle Razorpay Webhooks
// @route   POST /api/v1/webhooks/razorpay
// @access  Public
export const handleRazorpayWebhook = async (req, res, next) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'fallback_secret';
    
    // In production, verify signature
    // const signature = req.headers['x-razorpay-signature'];
    // const expectedSignature = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
    // if (expectedSignature !== signature) return res.status(400).send('Invalid signature');

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'subscription.charged') {
      const subscriptionInfo = payload.subscription.entity;
      const paymentInfo = payload.payment.entity;
      
      const subscription = await Subscription.findOne({ razorpaySubscriptionId: subscriptionInfo.id });
      
      if (subscription) {
        subscription.status = 'active';
        subscription.currentStart = new Date(subscriptionInfo.current_start * 1000);
        subscription.currentEnd = new Date(subscriptionInfo.current_end * 1000);
        subscription.nextBillingDate = new Date(subscriptionInfo.charge_at * 1000);
        await subscription.save();

        // Spawn a new Invoice
        const invoice = await Invoice.create({
          client: subscription.client,
          service: subscription.service,
          amount: paymentInfo.amount / 100,
          status: 'paid',
          dueDate: new Date(),
          paidAt: new Date(paymentInfo.created_at * 1000),
          subscriptionId: subscription._id,
        });

        // Spawn a Payment record
        await Payment.create({
          user: subscription.client,
          gateway: 'razorpay',
          transactionId: paymentInfo.id,
          amount: paymentInfo.amount / 100,
          status: 'success',
          invoice: invoice._id,
        });

        // Activate the Project
        if (subscription.project) {
          await Project.findByIdAndUpdate(subscription.project, { status: 'in_progress' });
        } else {
          const service = await Service.findById(subscription.service);
          const projectTitle = service ? `${service.title} (Monthly)` : 'Subscription Retainer';
          
          const project = await Project.create({
            client: subscription.client,
            service: subscription.service,
            title: projectTitle,
            description: `Auto-generated project for active subscription ${subscription.razorpaySubscriptionId}`,
            status: 'in_progress',
            isCustomRequest: false,
          });
          
          subscription.project = project._id;
          await subscription.save();
        }
      }
    } else if (event === 'subscription.halted' || event === 'subscription.cancelled') {
      const subscriptionInfo = payload.subscription.entity;
      const subscription = await Subscription.findOne({ razorpaySubscriptionId: subscriptionInfo.id });
      if (subscription) {
        subscription.status = event === 'subscription.halted' ? 'halted' : 'cancelled';
        await subscription.save();
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
};
