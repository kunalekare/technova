import mongoose from 'mongoose';

const internshipApplicationSchema = new mongoose.Schema(
  {
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InternshipListing',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Pending Review', 'Interviewing', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    phone: { type: String },
    linkedInUrl: { type: String },
    githubOrPortfolioUrl: { type: String },
    universityName: { type: String },
    majorOrDegree: { type: String },
    expectedGraduation: { type: String },
    availability: { type: String },
    resumeUrl: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
    },
    skills: [String],
    portfolioLinks: [String],
    adminFeedback: String,
  },
  { timestamps: true }
);

const InternshipApplication = mongoose.model('InternshipApplication', internshipApplicationSchema);

export default InternshipApplication;
