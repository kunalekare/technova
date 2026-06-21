import AuditLog from '../models/AuditLog.js';

// @desc    Get all audit logs (Admin)
// @route   GET /api/v1/audit-logs
// @access  Private/Admin
export const getAuditLogs = async (req, res, next) => {
  try {
    // Pagination and basic filtering
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;

    const query = {};
    if (req.query.action) query.action = req.query.action;
    if (req.query.targetType) query.targetType = req.query.targetType;

    const logs = await AuditLog.find(query)
      .populate('actor', 'name email role')
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limit);

    const total = await AuditLog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: logs.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};
