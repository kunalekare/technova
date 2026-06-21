import mongoose from 'mongoose';

const recurringInvoiceSchema = new mongoose.Schema(
  {
    retainerPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RetainerPlan',
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue', 'cancelled'],
      default: 'pending',
    },
    paymentId: {
      type: String, // E.g., Razorpay payment/invoice ID
    },
  },
  { timestamps: true }
);

recurringInvoiceSchema.index({ client: 1, status: 1 });
recurringInvoiceSchema.index({ retainerPlan: 1 });

const RecurringInvoice = mongoose.model('RecurringInvoice', recurringInvoiceSchema);
export default RecurringInvoice;
