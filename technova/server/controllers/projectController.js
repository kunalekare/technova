import Project from '../models/Project.js';
import Service from '../models/Service.js';

// @desc    Create a new project
// @route   POST /api/v1/projects
// @access  Private (Client only)
export const createProject = async (req, res, next) => {
  try {
    const { serviceId, title, requirements, budget, deadline } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    const fileUrls = req.files ? req.files.map(file => file.path) : [];

    const project = await Project.create({
      client: req.user._id,
      service: serviceId,
      title,
      requirements,
      budget: budget || 0,
      deadline,
      files: fileUrls,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's projects
// @route   GET /api/v1/projects
// @access  Private
export const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ client: req.user._id })
      .populate('service', 'title icon')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID
// @route   GET /api/v1/projects/:id
// @access  Private
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('service', 'title icon')
      .populate('client', 'name email avatar')
      .populate({
        path: 'assignedTeam',
        populate: { path: 'user', select: 'name avatar' }
      });

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Check permissions (only owner or admin/team can view)
    const isOwner = project.client._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role?.name === 'admin' || req.user.role?.name === 'super_admin';
    const isAssignedTeam = project.assignedTeam.some(t => t.user._id.toString() === req.user._id.toString());

    if (!isOwner && !isAdmin && !isAssignedTeam) {
      res.status(403);
      throw new Error('Not authorized to access this project');
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a proposal for a project
// @route   PUT /api/v1/projects/:id/proposal
// @access  Private/Admin
export const sendProjectProposal = async (req, res, next) => {
  try {
    const { price, timeline, message } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    project.proposal = {
      price,
      timeline,
      message,
      sentAt: new Date(),
      isAccepted: false,
    };
    
    project.status = 'proposal_sent';

    await project.save();

    // Ideally send a Socket.io notification here
    import('../socket/socketServer.js').then(({ sendNotification }) => {
      sendNotification(project.client, {
        type: 'project',
        title: 'Proposal Received',
        message: `Admin has sent a proposal for project: ${project.title}`,
        link: `/dashboard/projects/${project._id}`
      });
    }).catch(err => console.error(err));

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};
