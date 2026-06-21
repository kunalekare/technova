import mongoose from 'mongoose';

const businessVerificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gstNumber: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    documentUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const BusinessVerification = mongoose.model('BusinessVerification', businessVerificationSchema);
export default BusinessVerification;
