import mongoose from 'mongoose';

const talentApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    title: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
    portfolioLinks: [String],
    resumeUrl: String,
    linkedInUrl: String,
    githubUrl: String,
    experienceDetails: [
      {
        role: String,
        company: String,
        duration: String,
        description: String,
      }
    ],
    adminNotes: String, // Internal notes for admins
  },
  { timestamps: true }
);

const TalentApplication = mongoose.model('TalentApplication', talentApplicationSchema);

export default TalentApplication;
