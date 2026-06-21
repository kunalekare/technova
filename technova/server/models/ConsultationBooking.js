import mongoose from 'mongoose';

const consultationBookingSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teamMember: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scheduledAt: { type: Date, required: true },
  meetingLink: { type: String },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('ConsultationBooking', consultationBookingSchema);
