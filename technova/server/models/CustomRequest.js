import mongoose from 'mongoose';

const customRequestSchema = new mongoose.Schema(
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
    company: {
      type: String,
      trim: true,
    },
    serviceName: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description/Requirements is required'],
    },
    budget: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'contacted', 'resolved'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const CustomRequest = mongoose.model('CustomRequest', customRequestSchema);
export default CustomRequest;
