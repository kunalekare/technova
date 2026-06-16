import mongoose from 'mongoose';

const internshipListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Internship title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      default: 'TechNova',
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // Optional: Null if internal TechNova internship, populated if a client posts it
    },
    department: {
      type: String,
      required: true,
      enum: ['Engineering', 'Design', 'Marketing', 'Data', 'Operations', 'Other'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    responsibilities: [String],
    requirements: [String],
    perks: [String],
    stipend: {
      type: String,
      required: true,
      default: 'Unpaid',
    },
    duration: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ['Remote', 'On-site', 'Hybrid'],
      default: 'Remote',
    },
    location: {
      type: String,
    },
    deadline: {
      type: Date,
      required: true,
    },
    openings: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['Draft', 'Pending', 'Active', 'Closed'],
      default: 'Pending', // Pending admin approval for client posts
    },
  },
  { timestamps: true }
);

// Index for search functionality
internshipListingSchema.index({
  title: 'text',
  description: 'text',
  company: 'text',
});

const InternshipListing = mongoose.model('InternshipListing', internshipListingSchema);

export default InternshipListing;
