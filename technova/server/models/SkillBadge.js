import mongoose from 'mongoose';

const skillBadgeSchema = new mongoose.Schema(
  {
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner',
      required: true,
    },
    skillName: {
      type: String,
      required: true,
    },
    assessmentScore: {
      type: Number,
      required: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('SkillBadge', skillBadgeSchema);
