import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    dueDate: Date,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending',
    },
    completedAt: Date,
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    requirements: {
      type: String,
      required: [true, 'Project requirements are required'],
    },
    files: [String], // Cloudinary URLs
    status: {
      type: String,
      enum: [
        'new',
        'in_review',
        'proposal_sent',
        'in_progress',
        'completed',
        'on_hold',
        'cancelled',
      ],
      default: 'new',
    },
    assignedTeam: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamMember',
      },
    ],
    milestones: [milestoneSchema],
    budget: {
      type: Number,
      default: 0,
    },
    deadline: Date,
    aiEstimate: {
      estimatedCost: Number,
      estimatedDays: Number,
      scopeSummary: String,
      generatedAt: Date,
    },
  },
  { timestamps: true }
);

projectSchema.index({ client: 1, status: 1 });
projectSchema.index({ status: 1 });

const Project = mongoose.model('Project', projectSchema);
export default Project;
