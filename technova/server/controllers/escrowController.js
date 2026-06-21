import EscrowTransaction from '../models/EscrowTransaction.js';
import { releaseFunds, disputeFunds } from '../services/escrow/escrowService.js';

// @desc    Get escrows for current user
// @route   GET /api/v1/escrow/my-escrows
// @access  Private
export const getMyEscrows = async (req, res, next) => {
  try {
    const escrows = await EscrowTransaction.find()
      .populate({
        path: 'order',
        match: { user: req.user._id },
        select: 'amount status project',
        populate: { path: 'project', select: 'title' }
      })
      .sort('-createdAt');

    // Filter out escrows where order didn't match the user (mongoose populate match leaves order null)
    const filteredEscrows = escrows.filter(e => e.order !== null);

    res.status(200).json({
      success: true,
      count: filteredEscrows.length,
      data: filteredEscrows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all escrows (Admin)
// @route   GET /api/v1/escrow
// @access  Private/Admin
export const getAllEscrows = async (req, res, next) => {
  try {
    const escrows = await EscrowTransaction.find()
      .populate({
        path: 'order',
        populate: [
          { path: 'user', select: 'name email' },
          { path: 'project', select: 'title' }
        ]
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: escrows.length,
      data: escrows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Release escrow funds (Admin)
// @route   POST /api/v1/escrow/:id/release
// @access  Private/Admin
export const releaseEscrowFunds = async (req, res, next) => {
  try {
    const escrow = await releaseFunds(req.params.id);
    
    res.status(200).json({
      success: true,
      data: escrow,
      message: 'Funds released successfully',
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Dispute escrow funds (Client/Admin)
// @route   POST /api/v1/escrow/:id/dispute
// @access  Private
export const disputeEscrowFunds = async (req, res, next) => {
  try {
    const escrow = await EscrowTransaction.findById(req.params.id).populate('order');
    if (!escrow) {
      res.status(404);
      throw new Error('Escrow not found');
    }

    if (escrow.order.user.toString() !== req.user._id.toString() && req.user.role?.name !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to dispute this escrow');
    }

    const updatedEscrow = await disputeFunds(req.params.id);
    
    res.status(200).json({
      success: true,
      data: updatedEscrow,
      message: 'Funds status changed to disputed',
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
