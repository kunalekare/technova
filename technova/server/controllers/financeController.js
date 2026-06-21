import RetainerPlan from '../models/RetainerPlan.js';
import Project from '../models/Project.js';
import Order from '../models/Order.js';
import { getRate } from '../services/payment/currencyService.js';

// @desc    Get financial forecast (Upcoming revenue)
// @route   GET /api/v1/finance/forecast
// @access  Private/Admin
export const getForecast = async (req, res, next) => {
  try {
    // 1. Calculate Monthly Retainer Run Rate (MRR)
    const activeRetainers = await RetainerPlan.find({ status: 'active' });
    let totalMRR_INR = 0;

    for (const plan of activeRetainers) {
      const rate = await getRate(plan.currency);
      // convert plan amount to INR
      const inrAmount = plan.monthlyAmount / rate;
      totalMRR_INR += inrAmount;
    }

    // 2. Calculate Pending Payments from Orders
    const pendingOrders = await Order.find({ status: 'pending' });
    let totalPending_INR = 0;

    for (const order of pendingOrders) {
      const rate = order.exchangeRateAtPurchase || await getRate(order.currency || 'INR');
      const inrAmount = order.amount / rate;
      totalPending_INR += inrAmount;
    }

    res.status(200).json({
      success: true,
      data: {
        mrr_inr: Math.round(totalMRR_INR),
        pending_orders_inr: Math.round(totalPending_INR),
        total_forecast_inr: Math.round(totalMRR_INR + totalPending_INR)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project profitability
// @route   GET /api/v1/finance/profitability
// @access  Private/Admin
export const getProfitability = async (req, res, next) => {
  try {
    // We calculate profit for completed or in-progress projects
    const projects = await Project.find({ status: { $in: ['in_progress', 'completed'] } })
      .populate('service', 'title internalCostEstimate isInternational')
      .populate('client', 'name');

    const profitabilityStats = [];

    for (const project of projects) {
      // Find orders related to this project
      const orders = await Order.find({ project: project._id, status: 'paid' });
      
      let totalRevenue_INR = 0;
      for (const order of orders) {
        const rate = order.exchangeRateAtPurchase || await getRate(order.currency || 'INR');
        totalRevenue_INR += order.amount / rate;
      }

      // If no orders linked directly, fallback to project budget (assuming budget is in INR for simplicity, but order is truth)
      if (orders.length === 0 && project.budget) {
        totalRevenue_INR = project.budget;
      }

      const cost = project.service?.internalCostEstimate || 0;
      const profit = totalRevenue_INR - cost;
      const profitMargin = totalRevenue_INR > 0 ? (profit / totalRevenue_INR) * 100 : 0;

      profitabilityStats.push({
        projectId: project._id,
        projectTitle: project.title,
        clientName: project.client?.name || 'Unknown',
        revenue_inr: Math.round(totalRevenue_INR),
        cost_inr: Math.round(cost),
        profit_inr: Math.round(profit),
        margin_percentage: Math.round(profitMargin),
        status: project.status
      });
    }

    // Sort by profit desc
    profitabilityStats.sort((a, b) => b.profit_inr - a.profit_inr);

    res.status(200).json({
      success: true,
      data: profitabilityStats
    });
  } catch (error) {
    next(error);
  }
};
