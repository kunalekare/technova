import mongoose from 'mongoose';

const annotationCommentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  x: { type: Number, required: true }, // percentage of image width
  y: { type: Number, required: true }, // percentage of image height
  text: { type: String, required: true },
  resolved: { type: Boolean, default: false }
}, { timestamps: true });

const designAnnotationSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  fileUrl: { type: String, required: true },
  comments: [annotationCommentSchema]
}, { timestamps: true });

export default mongoose.model('DesignAnnotation', designAnnotationSchema);
