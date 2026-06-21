import CommissionLedger from '../models/CommissionLedger.js';
import Partner from '../models/Partner.js';

export const getMyCommissions = async (req, res, next) => {
  try {
    const partner = await Partner.findOne({ user: req.user.id });
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner profile not found' });
    }

    const ledgers = await CommissionLedger.find({ partner: partner._id })
      .populate('project', 'title status budget')
      .sort('-createdAt');

    res.status(200).json({ success: true, data: ledgers });
  } catch (error) {
    next(error);
  }
};

export const getAllCommissions = async (req, res, next) => {
  try {
    const ledgers = await CommissionLedger.find()
      .populate({
        path: 'partner',
        populate: { path: 'user', select: 'name email avatar' }
      })
      .populate('project', 'title status budget')
      .sort('-createdAt');

    res.status(200).json({ success: true, data: ledgers });
  } catch (error) {
    next(error);
  }
};

export const markCommissionPaid = async (req, res, next) => {
  try {
    const ledger = await CommissionLedger.findById(req.params.id);
    if (!ledger) {
      return res.status(404).json({ success: false, message: 'Ledger entry not found' });
    }

    ledger.status = 'paid';
    await ledger.save();

    res.status(200).json({ success: true, data: ledger });
  } catch (error) {
    next(error);
  }
};
