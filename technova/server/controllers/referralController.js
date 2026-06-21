import Referral from '../models/Referral.js';
import User from '../models/User.js';
import { sendReferralInvite } from '../services/email/referralEmailService.js';

export const getMyReferrals = async (req, res, next) => {
  try {
    const referrals = await Referral.find({ referrer: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, data: referrals });
  } catch (error) {
    next(error);
  }
};

export const createReferral = async (req, res, next) => {
  try {
    const { refereeEmail } = req.body;
    
    // Check if referee is already a user
    const existingUser = await User.findOne({ email: refereeEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Check if referral already exists
    const existingReferral = await Referral.findOne({ refereeEmail });
    if (existingReferral) {
      return res.status(400).json({ success: false, message: 'Referral already sent to this email' });
    }

    const newReferral = await Referral.create({
      referrer: req.user.id,
      refereeEmail
    });

    const signupLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/register?ref=${req.user.id}`;
    
    await sendReferralInvite(refereeEmail, req.user.name, signupLink);

    res.status(201).json({ success: true, data: newReferral });
  } catch (error) {
    next(error);
  }
};
