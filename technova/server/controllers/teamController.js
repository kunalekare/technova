import TeamMember from '../models/TeamMember.js';
import User from '../models/User.js';

// @desc    Get all team members
// @route   GET /api/v1/team
// @access  Private/Admin
export const getTeamMembers = async (req, res, next) => {
  try {
    const members = await TeamMember.find()
      .populate('user', 'name email avatar')
      .populate('assignedProjects', 'title status');

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a team member
// @route   POST /api/v1/team
// @access  Private/Admin
export const addTeamMember = async (req, res, next) => {
  try {
    const { email, designation, department, skills } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('User not found. They must register first.');
    }

    // Check if already a member
    const existing = await TeamMember.findOne({ user: user._id });
    if (existing) {
      res.status(400);
      throw new Error('User is already a team member');
    }

    let parsedSkills = skills;
    if (typeof skills === 'string') {
      parsedSkills = skills.split(',').map(s => s.trim());
    }

    const member = await TeamMember.create({
      user: user._id,
      designation,
      department,
      skills: parsedSkills,
    });

    // Update user role to admin or staff if needed (optional)
    // if (user.role.name === 'client') { ... }

    const populated = await TeamMember.findById(member._id).populate('user', 'name email avatar');

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a team member
// @route   PUT /api/v1/team/:id
// @access  Private/Admin
export const updateTeamMember = async (req, res, next) => {
  try {
    if (typeof req.body.skills === 'string') {
      req.body.skills = req.body.skills.split(',').map(s => s.trim());
    }

    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email avatar');

    if (!member) {
      res.status(404);
      throw new Error('Team member not found');
    }

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    next(error);
  }
};
