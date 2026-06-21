import RetainerPlan from '../models/RetainerPlan.js';

// @desc    Create a retainer plan
// @route   POST /api/v1/retainers
// @access  Private/Admin
export const createRetainer = async (req, res, next) => {
  try {
    const { clientId, planName, monthlyAmount, currency, billingDay, includedHours } = req.body;

    const retainer = await RetainerPlan.create({
      client: clientId,
      planName,
      monthlyAmount,
      currency: currency || 'INR',
      billingDay,
      includedHours
    });

    res.status(201).json({
      success: true,
      data: retainer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all retainers (Admin)
// @route   GET /api/v1/retainers
// @access  Private/Admin
export const getRetainers = async (req, res, next) => {
  try {
    const retainers = await RetainerPlan.find().populate('client', 'name email');
    res.status(200).json({
      success: true,
      data: retainers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get client's retainers
// @route   GET /api/v1/retainers/my
// @access  Private
export const getMyRetainers = async (req, res, next) => {
  try {
    const retainers = await RetainerPlan.find({ client: req.user._id });
    res.status(200).json({
      success: true,
      data: retainers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update retainer status
// @route   PUT /api/v1/retainers/:id
// @access  Private/Admin
export const updateRetainer = async (req, res, next) => {
  try {
    const { status } = req.body;
    const retainer = await RetainerPlan.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!retainer) {
      res.status(404);
      throw new Error('Retainer plan not found');
    }

    res.status(200).json({
      success: true,
      data: retainer
    });
  } catch (error) {
    next(error);
  }
};
