import connectDB from './config/db.js';
import User from './models/User.js';
import Role from './models/Role.js';

const promote = async () => {
  await connectDB();
  const adminRole = await Role.findOne({ name: 'super_admin' });
  await User.updateOne({ email: 'admin@technova.com' }, { role: adminRole._id, name: 'Agency Admin' });
  console.log('Promoted successfully!');
  process.exit(0);
};

promote();
