import Order from '../models/Order.js';
import Project from '../models/Project.js';
import { createOrder } from '../services/payment/razorpayService.js';

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const placeOrder = async (req, res, next) => {
  try {
    const { projectId, pricingTier, amount } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Create Order in DB
    const order = await Order.create({
      user: req.user._id,
      service: project.service,
      project: projectId,
      pricingTier,
      amount,
      status: 'pending',
    });

    // Generate Razorpay mock order
    const razorpayOrder = await createOrder(amount, 'INR', order._id.toString());

    res.status(201).json({
      success: true,
      data: {
        order,
        paymentDetails: razorpayOrder,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('service', 'title icon')
      .populate('project', 'title')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('service')
      .populate('user', 'name email');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role?.name !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/v1/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('service', 'title')
      .populate('project', 'title')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};
