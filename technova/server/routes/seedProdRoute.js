import express from 'express';
import Role from '../models/Role.js';
import Category from '../models/Category.js';
import Service from '../models/Service.js';
import JobListing from '../models/JobListing.js';
import InternshipListing from '../models/InternshipListing.js';
import User from '../models/User.js';
import { roles, categories, sampleServices, sampleJobs, sampleInternships } from '../seeds/data/dummyData.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Clear existing data to prevent duplicates during multiple clicks
    await Role.deleteMany({});
    await Category.deleteMany({});
    await Service.deleteMany({});
    await JobListing.deleteMany({});
    await InternshipListing.deleteMany({});

    // Seed roles
    const createdRoles = await Role.insertMany(roles);

    // Seed categories
    const createdCategories = await Category.create(categories);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // Seed services
    const servicesWithCategoryIds = sampleServices.map((svc) => ({
      ...svc,
      category: categoryMap[svc.categoryName],
      categoryName: undefined,
    }));
    await Service.insertMany(servicesWithCategoryIds);

    // Dummy Admin User
    const adminExists = await User.findOne({ email: 'admin@technova.com' });
    const superAdminRole = createdRoles.find(r => r.name === 'super_admin');
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@technova.com',
        password: 'password123',
        role: superAdminRole._id,
        isVerified: true,
        status: 'active'
      });
    } else {
      adminExists.role = superAdminRole._id;
      adminExists.password = 'password123';
      await adminExists.save();
    }

    // Seed jobs
    await JobListing.insertMany(sampleJobs);

    // Seed internships
    await InternshipListing.insertMany(sampleInternships);

    // Dummy Client
    const clientExists = await User.findOne({ email: 'client@technova.com' });
    const clientRole = createdRoles.find(r => r.name === 'client');
    if (!clientExists) {
      await User.create({
        name: 'Demo Client',
        email: 'client@technova.com',
        password: 'password123',
        role: clientRole._id,
        isVerified: true,
        status: 'active'
      });
    } else {
      clientExists.role = clientRole._id;
      clientExists.password = 'password123';
      await clientExists.save();
    }

    res.status(200).send(`
      <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1 style="color: #10B981;">✅ Production Database Seeded Successfully!</h1>
        <p>Your MongoDB Atlas database has been populated with all Services, Categories, Jobs, and Internships.</p>
        <p>You can now close this tab and refresh your main website.</p>
      </div>
    `);
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).send(`
      <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1 style="color: #EF4444;">❌ Seeding Failed</h1>
        <p>${error.message}</p>
      </div>
    `);
  }
});

export default router;
