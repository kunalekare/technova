import Message from '../models/Message.js';
import Project from '../models/Project.js';

// @desc    Get all messages for a specific project
// @route   GET /api/v1/messages/:projectId
// @access  Private (Client or Admin)
export const getProjectMessages = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // Verify project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const isClient = project.client.toString() === req.user._id.toString();
    const isAdmin = req.user.role?.name === 'admin' || req.user.role?.name === 'super_admin';
    const isPartner = project.assignedPartner?.toString() === req.user._id.toString();

    if (!isClient && !isAdmin && !isPartner) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these messages' });
    }

    const messages = await Message.find({ project: projectId })
      .populate('sender', 'name avatar')
      .sort('createdAt'); // Oldest first for chat UI

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};
