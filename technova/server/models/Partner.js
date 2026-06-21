import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['freelancer', 'agency'],
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    skills: [String],
    pastPerformanceScore: {
      type: Number,
      default: 0,
    },
    commissionRate: {
      type: Number,
      default: 20, // 20% by default
    },
  },
  { timestamps: true }
);

export default mongoose.model('Partner', partnerSchema);
