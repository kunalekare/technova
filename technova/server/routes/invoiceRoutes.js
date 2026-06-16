import express from 'express';
import { getMyInvoices, getInvoiceById } from '../controllers/invoiceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMyInvoices);

router.route('/:id')
  .get(getInvoiceById);

export default router;
