import mongoose from 'mongoose';

const hiringRequestSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    talent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TalentProfile',
      required: true,
    },
    projectTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    attachments: [String],
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Agreement Sent', 'Accepted', 'Rejected', 'Completed'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Deposit Paid', 'Fully Paid'],
      default: 'Unpaid',
    },
    adminNotes: String,
  },
  { timestamps: true }
);

const HiringRequest = mongoose.model('HiringRequest', hiringRequestSchema);

export default HiringRequest;
