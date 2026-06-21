import DesignAnnotation from '../models/DesignAnnotation.js';
import Project from '../models/Project.js';
import { getIO } from '../socket/socketServer.js';

export const getAnnotationsByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    // Check if project exists and user has access (admin/staff or owner)
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const userRole = req.user.role?.name || req.user.role;
    if (userRole !== 'admin' && userRole !== 'staff' && userRole !== 'super_admin' && project.client.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view annotations for this project' });
    }

    const annotations = await DesignAnnotation.find({ project: projectId }).populate('comments.author', 'name avatar');
    res.status(200).json({ success: true, data: annotations });
  } catch (error) {
    next(error);
  }
};

export const addAnnotationComment = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { fileUrl, x, y, text } = req.body;

    let annotation = await DesignAnnotation.findOne({ project: projectId, fileUrl });
    
    if (!annotation) {
      annotation = new DesignAnnotation({ project: projectId, fileUrl, comments: [] });
    }

    annotation.comments.push({
      author: req.user.id,
      x,
      y,
      text
    });

    await annotation.save();
    // Populate author before returning
    await annotation.populate('comments.author', 'name avatar');

    // Emit socket event to project room
    try {
      const io = getIO();
      io.to(`project_${projectId}`).emit('annotationUpdated', { fileUrl });
    } catch (err) {
      console.error('Socket emission failed:', err);
    }

    res.status(201).json({ success: true, data: annotation });
  } catch (error) {
    next(error);
  }
};

export const resolveAnnotationComment = async (req, res, next) => {
  try {
    const { projectId, commentId } = req.params;

    const annotation = await DesignAnnotation.findOne({ project: projectId, 'comments._id': commentId });
    if (!annotation) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const comment = annotation.comments.id(commentId);
    comment.resolved = true;
    await annotation.save();
    await annotation.populate('comments.author', 'name avatar');

    // Emit socket event
    try {
      const io = getIO();
      io.to(`project_${projectId}`).emit('annotationUpdated', { fileUrl: annotation.fileUrl });
    } catch (err) {
      console.error('Socket emission failed:', err);
    }

    res.status(200).json({ success: true, data: annotation });
  } catch (error) {
    next(error);
  }
};
