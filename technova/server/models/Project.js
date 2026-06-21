import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    meetLink: String,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    summary: String,
    actionItems: [String],
    keyDecisions: [String],
  },
  { _id: true, timestamps: true }
);

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
    assignedPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner',
      default: null,
    },
    milestones: [milestoneSchema],
    meetings: [meetingSchema],
    budget: {
      type: Number,
      default: 0,
    },
    deadline: Date,
    proposal: {
      price: Number,
      timeline: String,
      message: String,
      sentAt: Date,
      isAccepted: {
        type: Boolean,
        default: false,
      },
    },
    isCustomRequest: {
      type: Boolean,
      default: false,
    },
    customRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CustomRequest',
      default: null,
    },
    aiEstimate: {
      estimatedCost: Number,
      estimatedDays: Number,
      scopeSummary: String,
      generatedAt: Date,
    },
    riskScore: {
      type: Number,
      default: null, // Populated via nightly AI cron job
    },
  },
  { timestamps: true }
);

projectSchema.index({ client: 1, status: 1 });
projectSchema.index({ status: 1 });

const Project = mongoose.model('Project', projectSchema);
export default Project;
