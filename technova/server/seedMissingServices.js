import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Category from './models/Category.js';
import Service from './models/Service.js';
import connectDB from './config/db.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    const getCategory = async (name) => {
      let cat = await Category.findOne({ name });
      if (!cat) {
        cat = await Category.create({ name, description: `${name} services` });
      }
      return cat;
    };

    const designCat = await getCategory('Design');
    const consultingCat = await getCategory('Consulting');
    const mediaCat = await getCategory('Content & Media');
    const dataCat = await getCategory('Data Management');

    const servicesToAdd = [
      {
        title: '3D Architecture',
        category: designCat._id,
        subCategory: '3D Modeling',
        description: 'Professional 3D architectural modeling and visualization services for real estate and construction projects. We create photorealistic renders, walkthroughs, and accurate scale models.',
        shortDescription: 'Professional 3D architectural modeling and visualization services.',
        tags: ['3d', 'architecture', 'rendering', 'modeling'],
        pricingTiers: [
          { name: 'Basic', price: 499, deliveryDays: 7, features: ['1 Exterior Render', 'Basic Texturing', '2 Revisions'] },
          { name: 'Standard', price: 999, deliveryDays: 14, features: ['3 High-Res Renders', 'Advanced Lighting', 'Interior & Exterior', '5 Revisions'] },
          { name: 'Premium', price: 1999, deliveryDays: 21, features: ['5 High-Res Renders', '3D Walkthrough Video', 'Source Files', 'Unlimited Revisions'] }
        ]
      },
      {
        title: 'Consulting Services',
        category: consultingCat._id,
        subCategory: 'Business Strategy',
        description: 'Expert business and technology consulting to help you scale, optimize processes, and implement the right technology stack for your enterprise.',
        shortDescription: 'Expert business and technology consulting to help you scale.',
        tags: ['consulting', 'strategy', 'business', 'tech'],
        pricingTiers: [
          { name: 'Basic', price: 199, deliveryDays: 2, features: ['1 Hour Consultation', 'Basic Audit', 'Action Plan Summary'] },
          { name: 'Standard', price: 499, deliveryDays: 5, features: ['3 Hours Consultation', 'Detailed Strategy Report', 'Process Mapping'] },
          { name: 'Premium', price: 1499, deliveryDays: 14, features: ['10 Hours Consulting', 'Complete Digital Transformation Plan', 'Vendor Selection'] }
        ]
      },
      {
        title: 'Content Creation',
        category: mediaCat._id,
        subCategory: 'Digital Content',
        description: 'High-quality digital content creation including blog posts, copywriting, social media content, and digital graphics to boost your online presence.',
        shortDescription: 'High-quality digital content creation for your brand.',
        tags: ['content', 'writing', 'copywriting', 'social media'],
        pricingTiers: [
          { name: 'Basic', price: 149, deliveryDays: 3, features: ['2 Blog Posts', 'SEO Optimized', '1 Revision'] },
          { name: 'Standard', price: 399, deliveryDays: 7, features: ['5 Blog Posts', 'Social Media Copy', 'Keyword Research'] },
          { name: 'Premium', price: 899, deliveryDays: 14, features: ['Monthly Content Strategy', '10 Premium Articles', 'Newsletter Copy'] }
        ]
      },
      {
        title: 'Excel Services',
        category: dataCat._id,
        subCategory: 'Data Analysis',
        description: 'Advanced Excel automation, VBA macros, complex formulas, and data dashboard creation. Let us organize, clean, and visualize your complex datasets.',
        shortDescription: 'Advanced Excel automation, VBA macros, and dashboard creation.',
        tags: ['excel', 'data', 'vba', 'dashboards'],
        pricingTiers: [
          { name: 'Basic', price: 99, deliveryDays: 2, features: ['Data Cleaning', 'Basic Formulas', 'Formatting'] },
          { name: 'Standard', price: 299, deliveryDays: 5, features: ['Advanced Dashboards', 'Pivot Tables', 'Complex Formulas'] },
          { name: 'Premium', price: 599, deliveryDays: 10, features: ['Custom VBA Macros', 'Automated Reports', 'API Integrations'] }
        ]
      },
      {
        title: 'UI/UX Design',
        category: designCat._id,
        subCategory: 'Web Design',
        description: 'Stunning, user-centric UI/UX design for web and mobile applications. We deliver wireframes, interactive prototypes, and production-ready designs in Figma.',
        shortDescription: 'Stunning, user-centric UI/UX design for web and mobile applications.',
        tags: ['ui', 'ux', 'design', 'figma'],
        pricingTiers: [
          { name: 'Basic', price: 399, deliveryDays: 5, features: ['3 Page Designs', 'Wireframes', '2 Revisions'] },
          { name: 'Standard', price: 899, deliveryDays: 10, features: ['10 Page Designs', 'Interactive Prototype', 'Design System'] },
          { name: 'Premium', price: 1999, deliveryDays: 20, features: ['Complete App Design', 'User Testing', 'Developer Handoff', 'Unlimited Revisions'] }
        ]
      },
      {
        title: 'Video Editing',
        category: mediaCat._id,
        subCategory: 'Post Production',
        description: 'Professional video editing services for YouTube, corporate videos, commercials, and social media shorts. Includes color grading, transitions, and audio mixing.',
        shortDescription: 'Professional video editing services with color grading and audio mixing.',
        tags: ['video', 'editing', 'youtube', 'premiere'],
        pricingTiers: [
          { name: 'Basic', price: 149, deliveryDays: 3, features: ['Up to 5 Min Video', 'Basic Cuts', 'Background Music'] },
          { name: 'Standard', price: 349, deliveryDays: 7, features: ['Up to 15 Min Video', 'Color Grading', 'Motion Graphics', 'Sound Mixing'] },
          { name: 'Premium', price: 799, deliveryDays: 14, features: ['Up to 30 Min Video', 'Advanced VFX', 'Cinematic Grading', 'Source Files'] }
        ]
      }
    ];

    for (const s of servicesToAdd) {
      const existing = await Service.findOne({ title: s.title });
      if (!existing) {
        await Service.create(s);
        console.log('Created:', s.title);
      } else {
        console.log('Already exists:', s.title);
      }
    }

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
