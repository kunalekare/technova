import Order from '../models/Order.js';
import Project from '../models/Project.js';
import Payment from '../models/Payment.js';
import Invoice from '../models/Invoice.js';
import { createOrder, verifyPaymentSignature } from '../services/payment/razorpayService.js';
import { holdFunds } from '../services/escrow/escrowService.js';

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const placeOrder = async (req, res, next) => {
  try {
    const { projectId, pricingTier, amount, currency = 'INR', exchangeRateAtPurchase = null } = req.body;

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
      currency,
      exchangeRateAtPurchase,
      status: 'pending',
    });

    // Generate Razorpay mock order
    const razorpayOrder = await createOrder(amount, currency, order._id.toString());

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

// @desc    Verify payment and hold escrow
// @route   POST /api/v1/orders/:id/verify-payment
// @access  Private
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId).populate('project');
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    const isAuthentic = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isAuthentic) {
      res.status(400);
      throw new Error('Invalid payment signature');
    }

    // Payment is authentic, save it
    const payment = await Payment.create({
      order: order._id,
      user: req.user._id,
      gateway: 'razorpay',
      gatewayOrderId: razorpay_order_id,
      transactionId: razorpay_payment_id,
      amount: order.amount,
      status: 'success',
      signature: razorpay_signature,
    });

    order.paymentId = payment._id;
    order.status = 'paid';
    await order.save();

    // Create an Invoice for this order
    const invoice = await Invoice.create({
      client: req.user._id,
      service: order.service,
      order: order._id,
      amount: order.amount,
      status: 'paid',
      dueDate: new Date(),
      paidAt: new Date(),
    });

    // ESCROW LOGIC - Feature Flagged
    if (process.env.ESCROW_ENABLED === 'true') {
      try {
        await holdFunds(order._id, order.amount, order.project);
      } catch (escrowError) {
        console.error('Escrow holding failed:', escrowError);
        // We log the error but still return success for the payment verification
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: { order, payment }
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
