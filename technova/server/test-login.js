import 'dotenv/config';
import connectDB from './config/db.js';
import User from './models/User.js';

const testLogin = async () => {
  await connectDB();
  const user = await User.findOne({ email: 'agency@technova.com' }).select('+password');
  console.log('User found:', !!user);
  if (user) {
    console.log('Password hash:', user.password);
    const isMatch = await user.matchPassword('password123');
    console.log('Password match:', isMatch);
  }
  process.exit(0);
};

testLogin();
