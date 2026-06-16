import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Category from './models/Category.js';
import Service from './models/Service.js';
import connectDB from './config/db.js';

dotenv.config();

const fix = async () => {
  try {
    await connectDB();

    const servicesToFix = [
      { serviceName: '3D Architecture', catRegex: /3d/i },
      { serviceName: 'Consulting Services', catRegex: /consulting/i },
      { serviceName: 'Content Creation', catRegex: /content/i },
      { serviceName: 'Excel Services', catRegex: /excel/i },
      { serviceName: 'UI/UX Design', catRegex: /ui/i },
      { serviceName: 'Video Editing', catRegex: /video/i }
    ];

    for (const item of servicesToFix) {
      // Find the category the user created
      let cat = await Category.findOne({ name: { $regex: item.catRegex } });
      
      if (!cat) {
        // If user hasn't created the category yet, create it with the correct spelling
        const correctName = item.serviceName === 'UI/UX Design' ? 'UI/UX Design' : item.serviceName.replace(' Services', '');
        cat = await Category.create({ name: correctName, description: `${correctName} category` });
        console.log(`Created missing category: ${correctName}`);
      } else {
        console.log(`Found category: ${cat.name} for service ${item.serviceName}`);
      }

      // Update the service to point to this category
      const result = await Service.updateOne(
        { title: item.serviceName },
        { category: cat._id }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`Linked service '${item.serviceName}' to category '${cat.name}'`);
      }
    }

    console.log('✅ All done! The bug is solved. You can check the website now.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fix();
