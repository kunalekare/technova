import Ticket from '../models/Ticket.js';
import Notification from '../models/Notification.js';

// @desc    Create a new support ticket
// @route   POST /api/v1/tickets
// @access  Private
export const createTicket = async (req, res, next) => {
  try {
    const { subject, category, message, priority } = req.body;
    const attachments = req.files ? req.files.map(f => f.path || f.location || '') : [];

    const ticket = await Ticket.create({
      user: req.user._id,
      subject,
      category,
      priority: priority || 'medium',
      messages: [
        {
          sender: req.user._id,
          message,
          attachments,
        }
      ]
    });

    const populated = await Ticket.findById(ticket._id)
      .populate('user', 'name email avatar')
      .populate('messages.sender', 'name avatar');

    // Create notification
    await Notification.create({
      user: req.user._id,
      type: 'ticket',
      title: 'Ticket Created',
      message: `Your support ticket "${subject}" has been created.`,
      link: `/dashboard/tickets`,
    });

    res.status(201).json({
      success: true,
      data: populated,
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
      .populate('user', 'name email avatar')
      .populate('messages.sender', 'name avatar')
      .populate('assignedTo', 'name avatar')
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

// @desc    Get single ticket by ID
// @route   GET /api/v1/tickets/:id
// @access  Private
export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate('messages.sender', 'name avatar')
      .populate('assignedTo', 'name avatar');

    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    // Only ticket owner or admin can view
    const isOwner = ticket.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role?.name === 'admin' || req.user.role?.name === 'super_admin';
    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to view this ticket');
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add message to ticket thread
// @route   POST /api/v1/tickets/:id/messages
// @access  Private
export const addTicketMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const attachments = req.files ? req.files.map(f => f.path || f.location || '') : [];

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    const isOwner = ticket.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role?.name === 'admin' || req.user.role?.name === 'super_admin';
    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized');
    }

    ticket.messages.push({
      sender: req.user._id,
      message,
      attachments,
    });

    // If admin replies, move to in_progress
    if (isAdmin && ticket.status === 'open') {
      ticket.status = 'in_progress';
    }

    await ticket.save();

    const updated = await Ticket.findById(ticket._id)
      .populate('user', 'name email avatar')
      .populate('messages.sender', 'name avatar')
      .populate('assignedTo', 'name avatar');

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tickets (Admin)
// @route   GET /api/v1/tickets/all
// @access  Private/Admin
export const getAllTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find()
      .populate('user', 'name email avatar')
      .populate('messages.sender', 'name avatar')
      .populate('assignedTo', 'name avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};
