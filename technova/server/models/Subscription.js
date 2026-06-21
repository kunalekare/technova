import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    razorpayPlanId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
    },
    razorpaySubscriptionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['created', 'authenticated', 'active', 'pending', 'halted', 'cancelled', 'completed', 'expired'],
      default: 'created',
    },
    currentStart: {
      type: Date,
    },
    currentEnd: {
      type: Date,
    },
    nextBillingDate: {
      type: Date,
    },
    shortUrl: {
      type: String, // Link to pay the subscription for the first time
    },
  },
  { timestamps: true }
);

subscriptionSchema.index({ client: 1, status: 1 });
subscriptionSchema.index({ razorpaySubscriptionId: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
