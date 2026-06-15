import Lead from '../models/Lead.js';

// @desc    Create a new lead (public)
// @route   POST /api/v1/leads
// @access  Public
export const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, requirement, source } = req.body;

    const lead = await Lead.create({
      name,
      email,
      phone,
      requirement,
      source: source || 'website',
    });

    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leads (Kanban board)
// @route   GET /api/v1/leads
// @access  Private/Admin
export const getLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find().sort('-createdAt');

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead status
// @route   PUT /api/v1/leads/:id/status
// @access  Private/Admin
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};
