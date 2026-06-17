import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Service from './models/Service.js';

dotenv.config();

const test = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  const cats = await Category.find({}, 'name slug');
  console.log("ALL CATEGORIES:", cats);
  
  const archCat = cats.find(c => c.name.includes('3D'));
  console.log("3D Cat ID:", archCat?._id);
  
  if (archCat) {
    const services = await Service.find({ category: archCat._id }, 'title isActive category');
    console.log("SERVICES UNDER 3D CAT:", services);
  }
  
  process.exit(0);
};

test();
