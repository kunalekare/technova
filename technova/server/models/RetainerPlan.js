import mongoose from 'mongoose';

const retainerPlanSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    monthlyAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD'],
      default: 'INR',
    },
    billingDay: {
      type: Number,
      required: true,
      min: 1,
      max: 28, // Max 28 to avoid end-of-month issues (29,30,31)
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'cancelled'],
      default: 'active',
    },
    includedHours: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

retainerPlanSchema.index({ client: 1, status: 1 });

const RetainerPlan = mongoose.model('RetainerPlan', retainerPlanSchema);
export default RetainerPlan;
