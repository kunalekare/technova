import mongoose from 'mongoose';

const teamInviteSchema = new mongoose.Schema(
  {
    inviterUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    inviteeEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'finance'],
      default: 'viewer',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'revoked'],
      default: 'pending',
    },
    projectScope: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
  },
  { timestamps: true }
);

const TeamInvite = mongoose.model('TeamInvite', teamInviteSchema);
export default TeamInvite;
