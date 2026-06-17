import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Service from './models/Service.js';

dotenv.config();

const fixDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    // We want the category '3D Architecture & Visualization'
    let archCat = await Category.findOne({ name: '3D Architecture & Visualization' });
    let uxCat = await Category.findOne({ name: 'UI/UX Design' });
    let videoCat = await Category.findOne({ name: 'Video Editing' });
    let excelCat = await Category.findOne({ name: 'Excel Services' });

    console.log('Categories found:', { archCat: !!archCat, uxCat: !!uxCat, videoCat: !!videoCat, excelCat: !!excelCat });

    // Check services
    const s1 = await Service.find({ category: archCat?._id });
    const s2 = await Service.find({ category: uxCat?._id });
    
    console.log(`Services in 3D: ${s1.length}`);
    console.log(`Services in UX: ${s2.length}`);
    
    // Create if missing
    if (s1.length === 0 && archCat) {
      await Service.create({
        title: 'Professional 3D Architecture & Rendering',
        category: archCat._id,
        subCategory: '3D Modeling',
        description: 'Professional 3D architectural modeling and visualization services for real estate and construction projects. We create photorealistic renders, walkthroughs, and accurate scale models.',
        shortDescription: 'Professional 3D architectural modeling and visualization services.',
        tags: ['3d', 'architecture', 'rendering', 'modeling'],
        pricingTiers: [
          { name: 'Basic', price: 499, deliveryDays: 7, features: ['1 Exterior Render'] },
        ],
        isActive: true
      });
      console.log('Created 3D service');
    }

    if (s2.length === 0 && uxCat) {
      await Service.create({
        title: 'Professional UI/UX Design System',
        category: uxCat._id,
        subCategory: 'Web Design',
        description: 'Stunning, user-centric UI/UX design for web and mobile applications. We deliver wireframes, interactive prototypes, and production-ready designs in Figma.',
        shortDescription: 'Stunning, user-centric UI/UX design.',
        tags: ['ui', 'ux', 'design', 'figma'],
        pricingTiers: [
          { name: 'Basic', price: 399, deliveryDays: 5, features: ['3 Page Designs'] }
        ],
        isActive: true
      });
      console.log('Created UX service');
    }

    // Video Editing
    const s3 = await Service.find({ category: videoCat?._id });
    if (s3.length === 0 && videoCat) {
      await Service.create({
        title: 'Cinematic Video Editing & Post Production',
        category: videoCat._id,
        subCategory: 'Post Production',
        description: 'Professional video editing services for YouTube, corporate videos, commercials, and social media shorts. Includes color grading, transitions, and audio mixing.',
        shortDescription: 'Professional video editing services with color grading.',
        tags: ['video', 'editing', 'youtube', 'premiere'],
        pricingTiers: [{ name: 'Basic', price: 149, deliveryDays: 3, features: ['5 Min Video'] }],
        isActive: true
      });
      console.log('Created Video service');
    }

    // Excel
    const s4 = await Service.find({ category: excelCat?._id });
    if (s4.length === 0 && excelCat) {
      await Service.create({
        title: 'Advanced Excel Data Services',
        category: excelCat._id,
        subCategory: 'Data Analysis',
        description: 'Advanced Excel automation, VBA macros, complex formulas, and data dashboard creation. Let us organize, clean, and visualize your complex datasets.',
        shortDescription: 'Advanced Excel automation, VBA macros, and dashboard creation.',
        tags: ['excel', 'data', 'vba', 'dashboards'],
        pricingTiers: [{ name: 'Basic', price: 99, deliveryDays: 2, features: ['Data Cleaning'] }],
        isActive: true
      });
      console.log('Created Excel service');
    }

    console.log('Done fixing');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
fixDb();
