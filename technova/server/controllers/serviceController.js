import Service from '../models/Service.js';
import Review from '../models/Review.js';

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

    // Text search
    if (search) {
      query.$text = { $search: search };
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
