import CustomRequest from '../models/CustomRequest.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Role from '../models/Role.js';
import crypto from 'crypto';

// @desc    Submit a custom service request
// @route   POST /api/v1/custom-requests
// @access  Public
export const createCustomRequest = async (req, res, next) => {
  try {
    const { name, email, company, serviceName, description, budget } = req.body;

    const request = await CustomRequest.create({
      name,
      email,
      company,
      serviceName,
      description,
      budget,
    });

    // Check if user exists to auto-create the project dashboard
    const user = await User.findOne({ email });
    if (user) {
      const service = await Service.findOne({ title: 'Custom Project' }) || await Service.findOne();
      if (service) {
        await Project.create({
          client: user._id,
          service: service._id,
          title: serviceName,
          requirements: description,
          status: 'new',
          isCustomRequest: true,
          customRequestId: request._id,
        });
      }
    }

    res.status(201).json({
      success: true,
      data: request,
      message: 'Custom service request submitted successfully. We will contact you soon.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all custom service requests
// @route   GET /api/v1/custom-requests
// @access  Admin
export const getCustomRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};
    if (status) query.status = status;

    const startIndex = (page - 1) * limit;
    const total = await CustomRequest.countDocuments(query);

    const requests = await CustomRequest.find(query)
      .sort('-createdAt')
      .skip(startIndex)
      .limit(parseInt(limit, 10));

    res.json({
      success: true,
      count: requests.length,
      pagination: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / limit),
      },
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's custom requests
// @route   GET /api/v1/custom-requests/my-requests
// @access  Private
export const getMyCustomRequests = async (req, res, next) => {
  try {
    // CustomRequests are tied to email address
    const requests = await CustomRequest.find({ email: req.user.email })
      .sort('-createdAt');

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get custom request by ID (for clients)
// @route   GET /api/v1/custom-requests/:id
// @access  Private
export const getCustomRequestById = async (req, res, next) => {
  try {
    const request = await CustomRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Clients can only fetch their own requests; Admins can fetch any
    if (req.user.role === 'client' && request.email !== req.user.email) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this request' });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update custom request status
// @route   PUT /api/v1/custom-requests/:id/status
// @access  Admin
export const updateCustomRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const request = await CustomRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Convert custom request to project
// @route   POST /api/v1/custom-requests/:id/convert-to-project
// @access  Admin
export const convertToProject = async (req, res, next) => {
  try {
    const { proposalData } = req.body;
    
    const request = await CustomRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // 1. Find or Create User
    let user = await User.findOne({ email: request.email });
    if (!user) {
      const clientRole = await Role.findOne({ name: 'client' });
      // Create a random password
      const randomPassword = crypto.randomBytes(10).toString('hex');
      user = await User.create({
        name: request.name,
        email: request.email,
        password: randomPassword,
        role: clientRole ? clientRole._id : null,
      });
      // In a real app, send an email with login details here
    }

    // 2. Find or Create a dummy "Custom Service"
    let service = await Service.findOne({ title: 'Custom Project' });
    if (!service) {
      // Find a random category to satisfy schema requirement
      const Category = (await import('../models/Category.js')).default;
      const category = await Category.findOne();
      
      service = await Service.create({
        title: 'Custom Project',
        description: 'A custom service request converted into a project.',
        category: category ? category._id : null,
        pricingTiers: [{ name: 'Basic', price: proposalData?.price || 0, deliveryDays: 30 }],
      });
    }

    // 3. Find existing auto-created project or create new one
    let project = await Project.findOne({ customRequestId: request._id });
    
    if (project) {
      project.status = 'proposal_sent';
      project.isCustomRequest = false; // It is now a converted project
      project.proposal = {
        price: proposalData?.price || 0,
        timeline: proposalData?.timeline || 'TBD',
        message: 'We have reviewed your custom request and prepared a tailored proposal.',
        sentAt: new Date(),
      };
      project.budget = proposalData?.price || 0;
      project.aiEstimate = {
        estimatedCost: proposalData?.price || 0,
        scopeSummary: proposalData?.scopeSummary || '',
      };
      project.milestones = (proposalData?.milestones || []).map(m => ({
        title: m.title,
        description: m.description,
        status: 'pending'
      }));
      await project.save();
    } else {
      project = await Project.create({
        client: user._id,
        service: service._id,
        title: request.serviceName,
        requirements: request.description,
        status: 'proposal_sent',
        proposal: {
          price: proposalData?.price || 0,
          timeline: proposalData?.timeline || 'TBD',
          message: 'We have reviewed your custom request and prepared a tailored proposal.',
          sentAt: new Date(),
        },
        budget: proposalData?.price || 0,
        aiEstimate: {
          estimatedCost: proposalData?.price || 0,
          scopeSummary: proposalData?.scopeSummary || '',
        },
        milestones: (proposalData?.milestones || []).map(m => ({
          title: m.title,
          description: m.description,
          status: 'pending'
        }))
      });
    }

    // 4. Update request status
    request.status = 'resolved';
    await request.save();

    res.status(201).json({
      success: true,
      data: project,
      message: 'Successfully converted to project and proposal sent.'
    });
  } catch (error) {
    next(error);
  }
};
