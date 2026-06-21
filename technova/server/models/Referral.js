import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  refereeEmail: { type: String, required: true },
  status: { type: String, enum: ['pending', 'signed_up', 'rewarded'], default: 'pending' },
  rewardCredited: { type: Boolean, default: false },
  creditAmount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Referral', referralSchema);
