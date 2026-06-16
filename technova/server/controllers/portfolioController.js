import Portfolio from '../models/Portfolio.js';

// @desc    Get all portfolio items (Admin)
// @route   GET /api/v1/portfolio/admin
// @access  Private/Admin
export const getAdminPortfolios = async (req, res, next) => {
  try {
    const portfolios = await Portfolio.find()
      .populate('category', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: portfolios.length,
      data: portfolios,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a portfolio item
// @route   POST /api/v1/portfolio
// @access  Private/Admin
export const createPortfolio = async (req, res, next) => {
  try {
    if (req.files) {
      req.body.images = req.files.map(f => f.path || f.location);
    }

    if (typeof req.body.technologies === 'string') {
      req.body.technologies = req.body.technologies.split(',').map(t => t.trim());
    }

    const portfolio = await Portfolio.create(req.body);

    res.status(201).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a portfolio item
// @route   PUT /api/v1/portfolio/:id
// @access  Private/Admin
export const updatePortfolio = async (req, res, next) => {
  try {
    let portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      res.status(404);
      throw new Error('Portfolio item not found');
    }

    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(f => f.path || f.location);
    }

    if (typeof req.body.technologies === 'string') {
      req.body.technologies = req.body.technologies.split(',').map(t => t.trim());
    }

    portfolio = await Portfolio.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a portfolio item
// @route   DELETE /api/v1/portfolio/:id
// @access  Private/Admin
export const deletePortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      res.status(404);
      throw new Error('Portfolio item not found');
    }

    await portfolio.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get portfolio items (Public)
// @route   GET /api/v1/portfolio
// @access  Public
export const getPortfolios = async (req, res, next) => {
  try {
    const portfolios = await Portfolio.find()
      .populate('category', 'name slug')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: portfolios.length,
      data: portfolios,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single portfolio item
// @route   GET /api/v1/portfolio/:id
// @access  Public
export const getPortfolioById = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id)
      .populate('category', 'name slug');

    if (!portfolio) {
      res.status(404);
      throw new Error('Portfolio item not found');
    }

    res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    next(error);
  }
};
