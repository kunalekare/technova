import CustomRequest from '../models/CustomRequest.js';

// @desc    Submit a custom service request
// @route   POST /api/v1/custom-requests
// @access  Public
export const createCustomRequest = async (req, res, next) => {
  try {
    const { name, email, company, serviceName, description, budget } = req.body;

    const request = await CustomRequest.create({
      name,
      email,
      company,
      serviceName,
      description,
      budget,
    });

    res.status(201).json({
      success: true,
      data: request,
      message: 'Custom service request submitted successfully. We will contact you soon.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all custom service requests
// @route   GET /api/v1/custom-requests
// @access  Admin
export const getCustomRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};
    if (status) query.status = status;

    const startIndex = (page - 1) * limit;
    const total = await CustomRequest.countDocuments(query);

    const requests = await CustomRequest.find(query)
      .sort('-createdAt')
      .skip(startIndex)
      .limit(parseInt(limit, 10));

    res.json({
      success: true,
      count: requests.length,
      pagination: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / limit),
      },
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update custom request status
// @route   PUT /api/v1/custom-requests/:id/status
// @access  Admin
export const updateCustomRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const request = await CustomRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};
