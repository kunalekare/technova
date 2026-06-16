import TalentProfile from '../models/TalentProfile.js';
import TalentApplication from '../models/TalentApplication.js';
import HiringRequest from '../models/HiringRequest.js';

// @desc    Get all verified talent profiles with filtering and search
// @route   GET /api/v1/talent
// @access  Public
export const getTalent = async (req, res, next) => {
  try {
    const { category, search, sort = '-rating', page = 1, limit = 12 } = req.query;
    
    const query = { isActive: true, isVerified: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    let sortObj = {};
    if (sort === '-rating') sortObj = { rating: -1, totalReviews: -1 };
    else if (sort === 'rate_asc') sortObj = { hourlyRate: 1 };
    else if (sort === 'rate_desc') sortObj = { hourlyRate: -1 };
    else sortObj = { createdAt: -1 };

    const [talent, total] = await Promise.all([
      TalentProfile.find(query)
        .populate('user', 'name avatar')
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit)),
      TalentProfile.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: talent.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: talent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single talent profile by ID
// @route   GET /api/v1/talent/:id
// @access  Public
export const getTalentById = async (req, res, next) => {
  try {
    const talent = await TalentProfile.findById(req.params.id)
      .populate('user', 'name avatar email');

    if (!talent || !talent.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Talent profile not found',
      });
    }

    res.json({
      success: true,
      data: talent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit application to become a talent
// @route   POST /api/v1/talent/apply
// @access  Private
export const applyAsTalent = async (req, res, next) => {
  try {
    // Check if user already has a pending application or is already a talent
    const existingApp = await TalentApplication.findOne({ user: req.user._id, status: { $in: ['Pending', 'Approved'] } });
    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending or approved application',
      });
    }

    const application = await TalentApplication.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a hiring request for a talent
// @route   POST /api/v1/talent/:id/hire
// @access  Private
export const submitHiringRequest = async (req, res, next) => {
  try {
    const talent = await TalentProfile.findById(req.params.id);
    
    if (!talent || !talent.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Talent profile not found',
      });
    }

    const request = await HiringRequest.create({
      ...req.body,
      client: req.user._id,
      talent: talent._id,
    });

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's hiring requests (As client)
// @route   GET /api/v1/talent/my-hires
// @access  Private
export const getMyHires = async (req, res, next) => {
  try {
    const requests = await HiringRequest.find({ client: req.user._id })
      .populate('talent', 'title hourlyRate')
      .populate({ path: 'talent', populate: { path: 'user', select: 'name avatar' } })
      .sort('-createdAt');

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};
