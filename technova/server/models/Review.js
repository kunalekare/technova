import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews
reviewSchema.index({ user: 1, service: 1 }, { unique: true });

// Static method to calculate average rating for a service
reviewSchema.statics.calcAverageRating = async function (serviceId) {
  const result = await this.aggregate([
    { $match: { service: serviceId, isApproved: true } },
    {
      $group: {
        _id: '$service',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const Service = mongoose.model('Service');
  if (result.length > 0) {
    await Service.findByIdAndUpdate(serviceId, {
      avgRating: Math.round(result[0].avgRating * 10) / 10,
      totalReviews: result[0].totalReviews,
    });
  } else {
    await Service.findByIdAndUpdate(serviceId, {
      avgRating: 0,
      totalReviews: 0,
    });
  }
};

// Recalculate ratings after save
reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.service);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
