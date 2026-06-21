import BusinessVerification from '../models/BusinessVerification.js';

// @desc    Get user's business verification status
// @route   GET /api/v1/verifications/me
// @access  Private
export const getMyVerification = async (req, res, next) => {
  try {
    const verification = await BusinessVerification.findOne({ user: req.user._id });
    
    res.status(200).json({
      success: true,
      data: verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit business verification
// @route   POST /api/v1/verifications
// @access  Private
export const submitVerification = async (req, res, next) => {
  try {
    const { gstNumber, companyName, documentUrl } = req.body;

    let verification = await BusinessVerification.findOne({ user: req.user._id });
    if (verification && verification.status === 'verified') {
      res.status(400);
      throw new Error('Business is already verified');
    }

    if (verification) {
      // Update existing submission if pending or rejected
      verification.gstNumber = gstNumber;
      verification.companyName = companyName;
      verification.documentUrl = documentUrl;
      verification.status = 'pending';
      await verification.save();
    } else {
      // Create new
      verification = await BusinessVerification.create({
        user: req.user._id,
        gstNumber,
        companyName,
        documentUrl,
        status: 'pending',
      });
    }

    res.status(201).json({
      success: true,
      data: verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all business verifications (Admin)
// @route   GET /api/v1/verifications
// @access  Private/Admin
export const getAllVerifications = async (req, res, next) => {
  try {
    const verifications = await BusinessVerification.find()
      .populate('user', 'name email')
      .populate('verifiedBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: verifications.length,
      data: verifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update verification status (Admin)
// @route   PUT /api/v1/verifications/:id/status
// @access  Private/Admin
export const updateVerificationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['verified', 'rejected'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    const verification = await BusinessVerification.findById(req.params.id);
    if (!verification) {
      res.status(404);
      throw new Error('Verification record not found');
    }

    verification.status = status;
    verification.verifiedBy = req.user._id;
    await verification.save();

    res.status(200).json({
      success: true,
      data: verification,
    });
  } catch (error) {
    next(error);
  }
};
