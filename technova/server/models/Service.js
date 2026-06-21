import mongoose from 'mongoose';

const pricingTierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ['Basic', 'Standard', 'Premium'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    features: [String],
    deliveryDays: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subCategory: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
    },
    shortDescription: {
      type: String,
      maxlength: 200,
    },
    pricingTiers: [pricingTierSchema],
    images: [String],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    internalCostEstimate: {
      type: Number,
      default: null, // Admin only field
    },
    isInternational: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ tags: 1 });
serviceSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
