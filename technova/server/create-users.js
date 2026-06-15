import mongoose from 'mongoose';
import User from './models/User.js';
import Role from './models/Role.js';

const run = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/technova');
    console.log('Connected to DB!');

    const superAdminRole = await Role.findOne({ name: 'super_admin' });
    const clientRole = await Role.findOne({ name: 'client' });

    if (!superAdminRole) {
      console.log('Roles not found!');
      process.exit(1);
    }

    await User.deleteMany({ email: { $in: ['agency@technova.com', 'customer@technova.com'] } });

    await User.create({
      name: 'Agency Boss',
      email: 'agency@technova.com',
      password: 'password123',
      role: superAdminRole._id,
      isVerified: true,
      status: 'active'
    });

    await User.create({
      name: 'Regular Customer',
      email: 'customer@technova.com',
      password: 'password123',
      role: clientRole._id,
      isVerified: true,
      status: 'active'
    });

    console.log('SUCCESS_AGENCY_CUSTOMER');
    process.exit(0);
  } catch (e) {
    console.error('FAIL:', e);
    process.exit(1);
  }
};

run();
