import express from 'express';
import {
  createCustomRequest,
  getCustomRequests,
  updateCustomRequestStatus,
  convertToProject,
  getMyCustomRequests,
  getCustomRequestById,
} from '../controllers/customRequestController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for users to submit requests
router.post('/', createCustomRequest);

// Client protected routes
router.get('/my-requests', protect, getMyCustomRequests);
router.get('/:id', protect, getCustomRequestById);

// TEMPORARY MIGRATE ROUTE
router.get('/temp/migrate-all', async (req, res) => {
  try {
    const CustomRequest = (await import('../models/CustomRequest.js')).default;
    const Project = (await import('../models/Project.js')).default;
    const User = (await import('../models/User.js')).default;
    const Service = (await import('../models/Service.js')).default;
    
    const crs = await CustomRequest.find();
    let count = 0;
    for (let cr of crs) {
      const user = await User.findOne({email: cr.email});
      if (user) {
        const existingP = await Project.findOne({customRequestId: cr._id});
        if (!existingP) {
          const s = await Service.findOne({title: 'Custom Project'}) || await Service.findOne();
          await Project.create({
            client: user._id, 
            service: s._id, 
            title: cr.serviceName, 
            requirements: cr.description, 
            status: cr.status === 'resolved' ? 'completed' : cr.status === 'contacted' ? 'proposal_sent' : cr.status === 'reviewed' ? 'in_review' : 'new', 
            isCustomRequest: true, 
            customRequestId: cr._id, 
            budget: cr.budget
          });
          count++;
        }
      }
    }
    res.json({ migrated: count });
  } catch (err) { res.status(500).json({ error: err.message }); }
});



// Admin routes
router.use(protect, authorize('admin', 'super_admin'));
router.get('/', getCustomRequests);
router.put('/:id/status', updateCustomRequestStatus);
router.post('/:id/convert-to-project', convertToProject);

export default router;
