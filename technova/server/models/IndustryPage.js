import mongoose from 'mongoose';

const industryPageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  industryName: { type: String, required: true },
  heroText: { type: String },
  caseStudyRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio' }],
  seoMeta: {
    title: { type: String },
    description: { type: String },
    keywords: { type: String }
  }
}, { timestamps: true });

export default mongoose.model('IndustryPage', industryPageSchema);
