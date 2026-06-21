import cron from 'node-cron';
import RetainerPlan from '../models/RetainerPlan.js';
import RecurringInvoice from '../models/RecurringInvoice.js';

export const initBillingCron = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('Running daily retainer billing cron...');
      const today = new Date().getDate();
      
      const activePlans = await RetainerPlan.find({
        status: 'active',
        billingDay: today
      });
      
      if (activePlans.length === 0) {
        console.log(`No active retainers to bill on day ${today}`);
        return;
      }
      
      console.log(`Found ${activePlans.length} active retainers to bill.`);
      
      for (const plan of activePlans) {
        // Create an invoice
        const invoice = new RecurringInvoice({
          retainerPlan: plan._id,
          client: plan.client,
          amount: plan.monthlyAmount,
          currency: plan.currency || 'INR',
          dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
          status: 'pending'
        });
        
        await invoice.save();
        console.log(`Generated recurring invoice for plan ${plan._id}`);
      }
      
    } catch (error) {
      console.error('Error running billing cron:', error);
    }
  });
};
