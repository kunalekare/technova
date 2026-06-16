import Invoice from '../models/Invoice.js';
import Order from '../models/Order.js';

// @desc    Get invoices for current user
// @route   GET /api/v1/invoices
// @access  Private
export const getMyInvoices = async (req, res, next) => {
  try {
    // Find all orders belonging to user
    const userOrders = await Order.find({ user: req.user._id }).select('_id');
    const orderIds = userOrders.map(o => o._id);

    const invoices = await Invoice.find({ order: { $in: orderIds } })
      .populate({
        path: 'order',
        populate: [
          { path: 'service', select: 'title' },
          { path: 'user', select: 'name email phone' },
          { path: 'project', select: 'title' },
        ],
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single invoice (for PDF download data)
// @route   GET /api/v1/invoices/:id
// @access  Private
export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate({
        path: 'order',
        populate: [
          { path: 'service', select: 'title description pricingTiers' },
          { path: 'user', select: 'name email phone' },
          { path: 'project', select: 'title requirements' },
        ],
      });

    if (!invoice) {
      res.status(404);
      throw new Error('Invoice not found');
    }

    // Verify ownership
    if (invoice.order.user._id.toString() !== req.user._id.toString() &&
        req.user.role?.name !== 'admin' && req.user.role?.name !== 'super_admin') {
      res.status(403);
      throw new Error('Not authorized to access this invoice');
    }

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};
