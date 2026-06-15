import connectDB from './config/db.js';
import User from './models/User.js';

const check = async () => {
  await connectDB();
  const u1 = await User.findOne({email: 'agency@technova.com'}).select('+password');
  console.log('Agency User:', u1 ? 'Exists' : 'Missing');
  if (u1) console.log('Hashed password:', u1.password);
  process.exit(0);
};

check();
