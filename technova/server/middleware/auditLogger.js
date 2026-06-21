import AuditLog from '../models/AuditLog.js';
import logger from '../utils/logger.js';

/**
 * Middleware to log admin/user actions into the AuditLog collection
 * @param {string} targetType - The type of resource being modified (e.g., 'Project', 'Order', 'User')
 * @param {string} action - The action being performed (e.g., 'UPDATE_STATUS', 'RELEASE_FUNDS')
 */
export const auditLogger = (targetType, action) => async (req, res, next) => {
  // Capture the original send to log after the request completes successfully
  const originalSend = res.send;

  res.send = function (data) {
    res.send = originalSend; // Restore original to prevent double calling
    
    // Only log successful requests (or we can log failures too if needed, but usually we just want successful mutations)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      try {
        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          parsedData = data;
        }

        // Try to guess the target ID from params or response data
        const targetId = req.params.id || (parsedData.data && parsedData.data._id) || null;

        AuditLog.create({
          actor: req.user ? req.user._id : null,
          action: action,
          targetType: targetType,
          targetId: targetId,
          metadata: {
            method: req.method,
            url: req.originalUrl,
            body: req.body, // Be careful not to log passwords!
          },
          ipAddress: req.ip || req.connection.remoteAddress,
        }).catch(err => logger.error('Failed to write audit log:', err));

      } catch (error) {
        logger.error('Audit Logger Error:', error);
      }
    }
    
    return res.send(data);
  };

  next();
};
