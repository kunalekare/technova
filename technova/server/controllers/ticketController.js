import Ticket from '../models/Ticket.js';

// @desc    Create a new support ticket
// @route   POST /api/v1/tickets
// @access  Private
export const createTicket = async (req, res, next) => {
  try {
    const { subject, category, message, priority } = req.body;

    const ticket = await Ticket.create({
      user: req.user._id,
      subject,
      category,
      priority: priority || 'medium',
      messages: [
        {
          sender: req.user._id,
          message,
          isAdmin: false,
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user tickets
// @route   GET /api/v1/tickets
// @access  Private
export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .sort('-updatedAt');

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};
