import express from 'express';
import { 
  getMyContracts, 
  getAllContracts, 
  createAndSendContract, 
  signContract 
} from '../controllers/contractController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMyContracts)
  .post(authorize('admin', 'super_admin'), createAndSendContract);

router.route('/all')
  .get(authorize('admin', 'super_admin'), getAllContracts);

router.route('/:id/sign')
  .post(signContract);

export default router;
