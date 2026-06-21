import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      required: true, // e.g., "Order", "Project", "Contract"
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
  },
  { timestamps: true }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
