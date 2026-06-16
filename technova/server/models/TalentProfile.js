import mongoose from 'mongoose';

const talentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Professional title is required'],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
    },
    location: {
      type: String,
      default: 'Remote',
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: [5, 'Hourly rate must be at least $5'],
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: [v => v.length > 0, 'At least one skill is required'],
    },
    experience: [
      {
        role: String,
        company: String,
        duration: String,
        description: String,
      }
    ],
    availability: {
      type: String,
      enum: ['Available Now', 'Part-time', 'Full-time', 'Busy'],
      default: 'Available Now',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for search functionality
talentProfileSchema.index({
  title: 'text',
  bio: 'text',
  skills: 'text',
  category: 'text'
});

const TalentProfile = mongoose.model('TalentProfile', talentProfileSchema);

export default TalentProfile;
