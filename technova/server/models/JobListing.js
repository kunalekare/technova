import mongoose from 'mongoose';

const jobListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    department: {
      type: String,
      required: true,
      enum: ['Engineering', 'Design', 'Marketing', 'Data', 'Operations', 'Sales', 'Other'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    responsibilities: [String],
    requirements: [String],
    benefits: [String],
    salaryRange: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract'],
      default: 'Full-time',
    },
    mode: {
      type: String,
      enum: ['Remote', 'On-site', 'Hybrid'],
      default: 'Remote',
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Draft', 'Active', 'Closed'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

// Index for search functionality
jobListingSchema.index({
  title: 'text',
  description: 'text',
});

const JobListing = mongoose.model('JobListing', jobListingSchema);

export default JobListing;
