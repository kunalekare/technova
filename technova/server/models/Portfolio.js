import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Portfolio title is required'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    client: {
      type: String,
      default: 'Confidential',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    challenge: String,
    solution: String,
    results: String,
    images: [String],
    technologies: [String],
    link: String,
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;
