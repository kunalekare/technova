import TeamInvite from '../models/TeamInvite.js';

/**
 * Middleware to enforce project scope for sub-users (teammates).
 * If the user is a sub-user (has parentAccount), check if they have accepted
 * a TeamInvite and if the requested project is in their projectScope.
 */
export const enforceProjectScope = async (req, res, next) => {
  try {
    // If the user is an admin or primary account holder, skip this check
    if (!req.user.parentAccount) {
      return next();
    }

    const projectId = req.params.id || req.body.project || req.body.projectId;

    if (!projectId) {
      // If no project context is found in the request, proceed carefully.
      // This middleware is meant for project-specific routes.
      return next();
    }

    // Find the accepted invite for this sub-user
    const invite = await TeamInvite.findOne({
      inviterUser: req.user.parentAccount,
      inviteeEmail: req.user.email,
      status: 'accepted',
    });

    if (!invite) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. No valid team invite found.',
      });
    }

    // Check if projectScope is empty (empty means access to all projects, or strict?
    // Let's assume empty means they have access to NO projects unless explicitly added, or ALL projects if we want to allow an "admin" role.
    // The requirement says "sees only the scoped project(s)". So empty means no access.)
    const hasAccess = invite.projectScope.some(id => id.toString() === projectId.toString());

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to view or modify this project.',
      });
    }

    // Attach role for downstream controllers if needed
    req.subUserRole = invite.role;

    next();
  } catch (error) {
    console.error('Scope Permission Error:', error);
    res.status(500).json({ success: false, message: 'Server Error verifying scope' });
  }
};
