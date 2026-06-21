import cron from 'node-cron';
import RetainerPlan from '../../models/RetainerPlan.js';
import RecurringInvoice from '../../models/RecurringInvoice.js';
import logger from '../../utils/logger.js';

/**
 * Runs every day at 1:00 AM to process recurring retainers
 */
export const processRecurringInvoices = async () => {
  try {
    logger.info('Starting daily retainer invoice generation job...');
    const today = new Date();
    const currentDay = today.getDate(); // 1-31

    // Find active retainer plans that match today's billing day
    // (If today is >= 28th and billing day is 28, we might want to handle edge cases, 
    // but schema enforces max 28 for simplicity)
    const activePlans = await RetainerPlan.find({
      status: 'active',
      billingDay: currentDay
    });

    for (const plan of activePlans) {
      // Check if an invoice was already generated for this month to prevent duplicates
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

      const existingInvoice = await RecurringInvoice.findOne({
        retainerPlan: plan._id,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      });

      if (!existingInvoice) {
        // Calculate due date (e.g., 7 days from generation)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);

        await RecurringInvoice.create({
          retainerPlan: plan._id,
          client: plan.client,
          amount: plan.monthlyAmount,
          currency: plan.currency,
          dueDate,
          status: 'pending'
        });
        
        logger.info(`Generated recurring invoice for plan ${plan._id} - ${plan.planName}`);
      }
    }
    
    logger.info('Daily retainer invoice generation completed.');
  } catch (error) {
    logger.error('Failed to process recurring invoices: ' + error.message);
  }
};

/**
 * Initialize the cron job
 */
export const initRetainerCronJob = () => {
  // Run at 01:00 every day
  cron.schedule('0 1 * * *', () => {
    processRecurringInvoices();
  });
  logger.info('Retainer billing cron job initialized.');
};
