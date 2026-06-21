import mongoose from 'mongoose';

const escrowTransactionSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    milestone: {
      type: mongoose.Schema.Types.ObjectId, // Refers to the specific milestone subdocument in Project
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['held', 'released', 'disputed', 'refunded'],
      default: 'held',
    },
    heldAt: {
      type: Date,
      default: Date.now,
    },
    releasedAt: Date,
  },
  { timestamps: true }
);

const EscrowTransaction = mongoose.model('EscrowTransaction', escrowTransactionSchema);
export default EscrowTransaction;
