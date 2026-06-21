import Subscription from '../models/Subscription.js';
import Service from '../models/Service.js';
import Project from '../models/Project.js';
import { createPlan, createSubscription } from '../services/payment/razorpayService.js';

// @desc    Create a new subscription checkout
// @route   POST /api/v1/subscriptions
// @access  Private
export const startSubscription = async (req, res, next) => {
  try {
    const { serviceId, amount, currency = 'INR', planName = 'Monthly Subscription' } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Generate razorpay plan
    const razorpayPlan = await createPlan(amount, currency, 'monthly', planName);
    
    // Generate razorpay subscription
    const razorpaySubscription = await createSubscription(razorpayPlan.id, req.user.email);

    // Create a pending Project to link to this subscription
    const project = await Project.create({
      client: req.user._id,
      service: service._id,
      title: `${service.title} (Monthly)`,
      description: `Auto-generated project for subscription plan ${planName}`,
      status: 'pending', // Will become active when payment is successful
      isCustomRequest: false,
    });

    // Save to DB
    const subscription = await Subscription.create({
      client: req.user._id,
      service: service._id,
      project: project._id,
      razorpayPlanId: razorpayPlan.id,
      razorpaySubscriptionId: razorpaySubscription.id,
      amount,
      status: 'created',
      shortUrl: razorpaySubscription.short_url,
    });

    res.status(201).json({
      success: true,
      data: subscription,
      projectId: project._id, // Return project ID so frontend can redirect
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's active subscriptions
// @route   GET /api/v1/subscriptions/my-subscriptions
// @access  Private
export const getMySubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ client: req.user._id })
      .populate('service', 'title icon')
      .sort('-createdAt');

    res.json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a subscription
// @route   PUT /api/v1/subscriptions/:id/cancel
// @access  Private
export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ _id: req.params.id, client: req.user._id });
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    // In a real app, call razorpay.subscriptions.cancel(subscription.razorpaySubscriptionId)
    subscription.status = 'cancelled';
    await subscription.save();

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};
