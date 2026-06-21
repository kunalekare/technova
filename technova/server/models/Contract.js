import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pdfUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'signed'],
      default: 'draft',
    },
    signedAt: Date,
    signatureProvider: {
      type: String,
      default: 'docusign',
    },
  },
  { timestamps: true }
);

const Contract = mongoose.model('Contract', contractSchema);
export default Contract;
