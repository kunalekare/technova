import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ['client', 'admin', 'team_member', 'super_admin'],
      required: true,
      unique: true,
    },
    permissions: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

const Role = mongoose.model('Role', roleSchema);
export default Role;
