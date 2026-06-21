import Project from '../models/Project.js';
import Service from '../models/Service.js';
import { summarizeMeeting } from '../services/ai/meetingSummarizerService.js';
import { matchPartners } from '../services/ai/matchingEngineService.js';
import Partner from '../models/Partner.js';
import CommissionLedger from '../models/CommissionLedger.js';

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

    const fileUrls = req.files ? req.files.map(file => {
      if (file.path) return file.path;
      if (file.buffer) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        return `data:${file.mimetype};base64,${b64}`;
      }
      return null;
    }).filter(url => url !== null) : [];

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
      })
      .populate({
        path: 'assignedPartner',
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

// @desc    Update project status/team (Admin)
// @route   PUT /api/v1/projects/:id/admin
// @access  Private/Admin
export const updateProjectAdmin = async (req, res, next) => {
  try {
    const { status, assignedTeam, assignedPartner } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (status) {
      project.status = status;
      // If marking as completed and there is a partner, generate commission ledger
      if (status === 'completed' && project.assignedPartner) {
        const partner = await Partner.findById(project.assignedPartner);
        if (partner) {
          const exists = await CommissionLedger.findOne({ project: project._id });
          if (!exists) {
            const gross = project.budget || 0;
            const rate = partner.commissionRate || 20;
            const comm = (gross * rate) / 100;
            const net = gross - comm; // For marketplace payouts, partner gets net payout (budget - our cut) or they get a % of budget? Usually partner gets % of budget. The ledger schema says grossAmount, commissionAmount, netPayout. If we charge client 100, partner gets 80 (80%), our commission is 20 (20%). So partner.commissionRate = 20 means our take is 20%. Net payout = 80.
            
            await CommissionLedger.create({
              partner: partner._id,
              project: project._id,
              grossAmount: gross,
              commissionAmount: comm,
              netPayout: gross - comm,
              status: 'pending'
            });
          }
        }
      }
    }
    
    if (assignedTeam !== undefined) project.assignedTeam = assignedTeam;
    if (assignedPartner !== undefined) project.assignedPartner = assignedPartner;

    await project.save();

    const updatedProject = await Project.findById(req.params.id)
      .populate('service', 'title icon')
      .populate('client', 'name email avatar')
      .populate('client', 'name email avatar')
      .populate({
        path: 'assignedTeam',
        populate: { path: 'user', select: 'name avatar' }
      })
      .populate({
        path: 'assignedPartner',
        populate: { path: 'user', select: 'name avatar' }
      });

    res.status(200).json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule a Google Meet
// @route   POST /api/v1/projects/:id/meetings
// @access  Private
export const scheduleMeeting = async (req, res, next) => {
  try {
    const { title, date, meetLink } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Basic permission check
    const isOwner = project.client.toString() === req.user._id.toString();
    const isAdmin = req.user.role?.name === 'admin' || req.user.role?.name === 'super_admin';
    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized');
    }

    // Mock Google Meet generation if not provided
    const finalMeetLink = meetLink || `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;

    project.meetings.push({
      title,
      date,
      meetLink: finalMeetLink,
      status: 'scheduled'
    });

    await project.save();

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Summarize a meeting and attach to project
// @route   POST /api/v1/projects/:id/meetings/:meetingId/summarize
// @access  Private/Admin
export const summarizeProjectMeeting = async (req, res, next) => {
  try {
    const { textTranscript } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    const meeting = project.meetings.id(req.params.meetingId);
    if (!meeting) {
      res.status(404);
      throw new Error('Meeting not found');
    }

    let filePath = null;
    let mimeType = null;
    if (req.file) {
      filePath = req.file.path;
      mimeType = req.file.mimetype;
    }

    if (!textTranscript && !filePath) {
      res.status(400);
      throw new Error('Please provide either a text transcript or an audio file');
    }

    const aiSummary = await summarizeMeeting(null, filePath, mimeType, textTranscript);

    // Update meeting with AI response
    meeting.summary = typeof aiSummary === 'string' ? aiSummary : aiSummary.summary || JSON.stringify(aiSummary);
    meeting.actionItems = typeof aiSummary !== 'string' ? aiSummary.actionItems : [];
    meeting.keyDecisions = typeof aiSummary !== 'string' ? aiSummary.keyDecisions : [];
    meeting.status = 'completed';

    await project.save();

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const matchPartnersForProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const partners = await Partner.find({ verificationStatus: 'verified' }).populate('user', 'name avatar');
    const matched = await matchPartners(project.requirements, partners);

    res.status(200).json({ success: true, data: matched });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload deliverables/files to a project
// @route   POST /api/v1/projects/:id/files
// @access  Private (Admin/Team/Partner)
export const uploadProjectFiles = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const newFileUrls = req.files.map(file => {
      if (file.path) return file.path;
      if (file.buffer) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        return `data:${file.mimetype};base64,${b64}`;
      }
      return null;
    }).filter(url => url !== null);

    // Clean up any existing bad data (nulls/undefined/objects)
    const existingValidFiles = (project.files || []).filter(f => typeof f === 'string' && f.trim() !== '');

    project.files = [...existingValidFiles, ...newFileUrls];

    await project.save();

    res.status(200).json({
      success: true,
      data: project.files,
    });
  } catch (error) {
    next(error);
  }
};
