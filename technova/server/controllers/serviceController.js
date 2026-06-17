import Service from '../models/Service.js';
import Review from '../models/Review.js';
import Category from '../models/Category.js';

// @desc    Get services with filters, search, sort, pagination
// @route   GET /api/v1/services
// @access  Public
export const getServices = async (req, res, next) => {
  try {
    const {
      category,
      subCategory,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 12,
      featured,
      minPrice,
      maxPrice,
    } = req.query;

    const query = { isActive: true };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Sub-category filter
    if (subCategory) {
      query.subCategory = subCategory;
    }

    // Featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Price range filter (checks Basic tier price)
    if (minPrice || maxPrice) {
      query['pricingTiers.0.price'] = {};
      if (minPrice) query['pricingTiers.0.price'].$gte = Number(minPrice);
      if (maxPrice) query['pricingTiers.0.price'].$lte = Number(maxPrice);
    }

    // Text search using Regex for more robust substring matching
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Build sort object
    let sortObj = {};
    if (sort === 'price_asc') {
      sortObj = { 'pricingTiers.0.price': 1 };
    } else if (sort === 'price_desc') {
      sortObj = { 'pricingTiers.0.price': -1 };
    } else if (sort === 'rating') {
      sortObj = { avgRating: -1 };
    } else if (sort === 'popular') {
      sortObj = { totalReviews: -1, avgRating: -1 };
    } else {
      sortObj = { createdAt: -1 };
    }

    const [services, total] = await Promise.all([
      Service.find(query)
        .populate('category', 'name slug icon')
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit)),
      Service.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: services.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service by ID
// @route   GET /api/v1/services/:id
// @access  Public
export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      'category',
      'name slug icon subCategories'
    );

    if (!service || !service.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    // Get approved reviews for this service
    const reviews = await Review.find({
      service: service._id,
      isApproved: true,
    })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .limit(10);

    // Get related services
    const relatedServices = await Service.find({
      category: service.category._id,
      _id: { $ne: service._id },
      isActive: true,
    })
      .populate('category', 'name slug')
      .limit(4);

    res.json({
      success: true,
      data: {
        service,
        reviews,
        relatedServices,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new service (Admin)
// @route   POST /api/v1/admin/services
// @access  Private/Admin
export const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    const populated = await service.populate('category', 'name slug icon');

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a service (Admin)
// @route   PUT /api/v1/admin/services/:id
// @access  Private/Admin
export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug icon');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/deactivate a service (Admin)
// @route   DELETE /api/v1/admin/services/:id
// @access  Private/Admin
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.json({
      success: true,
      message: 'Service deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

import mongoose from 'mongoose';
export const fixCategories = async (req, res, next) => {
  try {
    const Category = mongoose.model('Category');
    const Service = mongoose.model('Service');

    let archCat = await Category.findOne({ name: '3D Architecture & Visualization' });
    let uxCat = await Category.findOne({ name: 'UI/UX Design' });
    let videoCat = await Category.findOne({ name: 'Video Editing' });
    let excelCat = await Category.findOne({ name: 'Excel Services' });

    let count = 0;

    const s1 = await Service.find({ category: archCat?._id });
    if (s1.length === 0 && archCat) {
      await Service.create({
        title: 'Professional 3D Architecture & Rendering',
        category: archCat._id,
        subCategory: '3D Modeling',
        description: 'Professional 3D architectural modeling and visualization services for real estate and construction projects. We create photorealistic renders, walkthroughs, and accurate scale models.',
        shortDescription: 'Professional 3D architectural modeling and visualization services.',
        tags: ['3d', 'architecture', 'rendering', 'modeling'],
        pricingTiers: [{ name: 'Basic', price: 499, deliveryDays: 7, features: ['1 Exterior Render'] }],
        isActive: true
      });
      count++;
    }

    const s2 = await Service.find({ category: uxCat?._id });
    if (s2.length === 0 && uxCat) {
      await Service.create({
        title: 'Professional UI/UX Design System',
        category: uxCat._id,
        subCategory: 'Web Design',
        description: 'Stunning, user-centric UI/UX design for web and mobile applications. We deliver wireframes, interactive prototypes, and production-ready designs in Figma.',
        shortDescription: 'Stunning, user-centric UI/UX design.',
        tags: ['ui', 'ux', 'design', 'figma'],
        pricingTiers: [{ name: 'Basic', price: 399, deliveryDays: 5, features: ['3 Page Designs'] }],
        isActive: true
      });
      count++;
    }

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
      count++;
    }

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
      count++;
    }

    res.json({ success: true, message: `Successfully seeded ${count} missing services directly to existing categories!` });
  } catch (error) {
    next(error);
  }
};


