import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobListing',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending Review', 'Interviewing', 'Offered', 'Hired', 'Rejected'],
      default: 'Pending Review',
    },
    phone: { type: String },
    linkedInUrl: { type: String },
    githubOrPortfolioUrl: { type: String },
    experienceYears: { type: String },
    education: { type: String },
    currentCompany: { type: String },
    expectedSalary: { type: String },
    noticePeriod: { type: String },
    resumeUrl: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
    },
    adminFeedback: String,
  },
  { timestamps: true }
);

jobApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;
