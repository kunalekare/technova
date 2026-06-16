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

    const getCategory = async (name) => {
      let cat = await Category.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } });
      if (!cat) {
        cat = await Category.create({ name, description: `${name} services`, slug: name.toLowerCase().replace(/ /g, '-') });
      }
      return cat;
    };

    const designCat = await getCategory('Design');
    const consultingCat = await getCategory('Consulting');
    const mediaCat = await getCategory('Content & Media');
    const dataCat = await getCategory('Data Management');
    const archCat = await getCategory('3D Architecture');
    const uxCat = await getCategory('UI/UX Design');
    const excelCat = await getCategory('Excel Services');

    const servicesToAdd = [
      {
        title: '3D Architecture',
        category: archCat._id,
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
        category: excelCat._id,
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
        category: uxCat._id,
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

    let count = 0;
    for (const s of servicesToAdd) {
      const existing = await Service.findOne({ title: s.title });
      if (!existing) {
        await Service.create(s);
        count++;
      } else {
        // Fix category if needed
        existing.category = s.category;
        await existing.save();
      }
    }

    res.json({ success: true, message: `Fixed categories and added ${count} new services` });
  } catch (error) {
    next(error);
  }
};


