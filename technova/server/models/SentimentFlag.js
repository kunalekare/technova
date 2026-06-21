import mongoose from 'mongoose';

const sentimentFlagSchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    context: {
      type: String,
      enum: ['ticket', 'chat', 'project'],
      required: true,
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      required: true,
    },
    score: {
      type: Number,
    },
    flaggedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

sentimentFlagSchema.index({ messageId: 1, context: 1 });

const SentimentFlag = mongoose.model('SentimentFlag', sentimentFlagSchema);
export default SentimentFlag;
