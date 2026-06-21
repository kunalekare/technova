import mongoose from 'mongoose';

const partnerApplicationSchema = new mongoose.Schema(
  {
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner',
      required: true,
    },
    submittedDocs: [String],
    portfolioLink: String,
    linkedinUrl: String,
    experienceYears: Number,
    expectedHourlyRate: Number,
    availability: String,
    coverLetter: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewNotes: String,
  },
  { timestamps: true }
);

export default mongoose.model('PartnerApplication', partnerApplicationSchema);
