import mongoose from 'mongoose';

const commissionLedgerSchema = new mongoose.Schema(
  {
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner',
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    grossAmount: {
      type: Number,
      required: true,
    },
    commissionAmount: {
      type: Number,
      required: true,
    },
    netPayout: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('CommissionLedger', commissionLedgerSchema);
