import Partner from '../models/Partner.js';
import PartnerApplication from '../models/PartnerApplication.js';
import User from '../models/User.js';

export const applyForPartner = async (req, res, next) => {
  try {
    const { type, skills, portfolioLink, linkedinUrl, experienceYears, expectedHourlyRate, availability, coverLetter } = req.body;

    // Check if user is already a partner
    let partner = await Partner.findOne({ user: req.user.id });
    if (!partner) {
      partner = await Partner.create({
        user: req.user.id,
        type,
        skills,
      });
    }

    // Create Application
    const application = await PartnerApplication.create({
      partner: partner._id,
      portfolioLink,
      linkedinUrl,
      experienceYears: Number(experienceYears),
      expectedHourlyRate: Number(expectedHourlyRate),
      availability,
      coverLetter,
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

export const getMyPartnerProfile = async (req, res, next) => {
  try {
    const partner = await Partner.findOne({ user: req.user.id }).populate('user', 'name email avatar');
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner profile not found' });
    }
    
    const application = await PartnerApplication.findOne({ partner: partner._id }).sort('-createdAt');
    res.status(200).json({ success: true, data: { partner, application } });
  } catch (error) {
    next(error);
  }
};

export const getAllPartners = async (req, res, next) => {
  try {
    const partners = await Partner.find().populate('user', 'name email avatar');
    res.status(200).json({ success: true, data: partners });
  } catch (error) {
    next(error);
  }
};

export const getAllApplications = async (req, res, next) => {
  try {
    const applications = await PartnerApplication.find()
      .populate({
        path: 'partner',
        populate: { path: 'user', select: 'name email avatar' }
      })
      .sort('-createdAt');
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, reviewNotes, commissionRate } = req.body;
    const application = await PartnerApplication.findById(req.params.id).populate('partner');
    
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    application.reviewNotes = reviewNotes;
    application.reviewedBy = req.user.id;
    await application.save();

    if (status === 'approved') {
      const partner = await Partner.findById(application.partner._id);
      partner.verificationStatus = 'verified';
      if (commissionRate) partner.commissionRate = commissionRate;
      await partner.save();
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};
