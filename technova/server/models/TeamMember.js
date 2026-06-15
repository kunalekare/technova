import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    designation: {
      type: String,
      trim: true,
      default: '',
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    department: {
      type: String,
      enum: ['development', 'design', 'marketing', 'ai_ml', 'support', 'management'],
      required: true,
    },
    assignedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
    availability: {
      type: String,
      enum: ['available', 'busy', 'on_leave'],
      default: 'available',
    },
    bio: String,
    avatar: String,
  },
  { timestamps: true }
);

teamMemberSchema.index({ department: 1, availability: 1 });

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
export default TeamMember;
