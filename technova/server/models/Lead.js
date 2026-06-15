import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: String,
    requirement: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      enum: ['website', 'chatbot', 'referral', 'ads', 'newsletter', 'contact_form'],
      default: 'website',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
      default: 'new',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember',
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    notes: [
      {
        text: String,
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    convertedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
  },
  { timestamps: true }
);

leadSchema.index({ status: 1, source: 1 });
leadSchema.index({ email: 1 });

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
