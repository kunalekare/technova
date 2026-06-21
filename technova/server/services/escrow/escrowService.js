import EscrowTransaction from '../../models/EscrowTransaction.js';
import Order from '../../models/Order.js';

export const holdFunds = async (orderId, amount, milestoneId = null) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');

    const escrow = await EscrowTransaction.create({
      order: orderId,
      milestone: milestoneId || order.project, // Fallback if milestone not specified
      amount: amount || order.amount,
      status: 'held',
    });

    return escrow;
  } catch (error) {
    throw error;
  }
};

export const releaseFunds = async (escrowId) => {
  try {
    const escrow = await EscrowTransaction.findById(escrowId);
    if (!escrow) throw new Error('Escrow transaction not found');

    if (escrow.status !== 'held') {
      throw new Error(`Cannot release funds. Current status is ${escrow.status}`);
    }

    escrow.status = 'released';
    escrow.releasedAt = new Date();
    await escrow.save();

    return escrow;
  } catch (error) {
    throw error;
  }
};

export const disputeFunds = async (escrowId) => {
  try {
    const escrow = await EscrowTransaction.findById(escrowId);
    if (!escrow) throw new Error('Escrow transaction not found');

    if (escrow.status !== 'held') {
      throw new Error(`Cannot dispute funds. Current status is ${escrow.status}`);
    }

    escrow.status = 'disputed';
    await escrow.save();

    return escrow;
  } catch (error) {
    throw error;
  }
};
