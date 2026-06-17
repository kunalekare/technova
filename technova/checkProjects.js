import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

import Project from './server/models/Project.js';
import User from './server/models/User.js';

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const users = await User.find({});
  console.log(`Found ${users.length} users.`);
  
  for (const user of users) {
    const projects = await Project.countDocuments({ client: user._id });
    console.log(`User ${user.email} (${user._id}) has ${projects} projects.`);
  }

  const allProjects = await Project.find({});
  for (const p of allProjects) {
    if (!p.client) {
      console.log(`Project ${p.title} has NO client!`);
    } else {
      console.log(`Project ${p.title} -> Client ${p.client}`);
    }
  }

  mongoose.disconnect();
}

check().catch(console.error);
