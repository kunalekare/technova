import mongoose from 'mongoose';

const organizationBrandingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One branding per user
    },
    companyName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    primaryColor: {
      type: String,
      default: '#6366f1', // Indigo 500
    },
    secondaryColor: {
      type: String,
      default: '#a855f7', // Purple 500
    },
  },
  { timestamps: true }
);

const OrganizationBranding = mongoose.model('OrganizationBranding', organizationBrandingSchema);
export default OrganizationBranding;
