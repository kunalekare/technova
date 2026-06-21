import TeamInvite from '../models/TeamInvite.js';
import User from '../models/User.js';
import crypto from 'crypto';

// Get invites sent by the current user
export const getMySentInvites = async (req, res) => {
  try {
    const invites = await TeamInvite.find({ inviterUser: req.user._id })
      .populate('projectScope', 'title status');

    res.status(200).json({
      success: true,
      data: invites,
    });
  } catch (error) {
    console.error('Error fetching sent invites:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Send an invite
export const sendInvite = async (req, res) => {
  try {
    const { inviteeEmail, role, projectScope } = req.body;

    // Sub-users cannot invite others
    if (req.user.parentAccount) {
      return res.status(403).json({ success: false, message: 'Only primary account holders can invite teammates' });
    }

    // Check if an invite already exists
    const existingInvite = await TeamInvite.findOne({ inviterUser: req.user._id, inviteeEmail: inviteeEmail.toLowerCase() });
    if (existingInvite && existingInvite.status === 'pending') {
      return res.status(400).json({ success: false, message: 'A pending invite already exists for this email' });
    }

    // If the user already exists, auto-accept and link them (simplified flow for this demo)
    // In a real flow, you'd email them a magic link or token.
    const existingUser = await User.findOne({ email: inviteeEmail.toLowerCase() });
    
    let status = 'pending';
    if (existingUser) {
      existingUser.parentAccount = req.user._id;
      await existingUser.save();
      status = 'accepted';
    }

    const invite = await TeamInvite.create({
      inviterUser: req.user._id,
      inviteeEmail: inviteeEmail.toLowerCase(),
      role: role || 'viewer',
      status,
      projectScope: projectScope || [],
    });

    res.status(201).json({
      success: true,
      data: invite,
      message: status === 'accepted' ? 'User already exists and was linked automatically.' : 'Invite sent successfully.',
    });
  } catch (error) {
    console.error('Error sending invite:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Revoke an invite
export const revokeInvite = async (req, res) => {
  try {
    const invite = await TeamInvite.findById(req.params.id);

    if (!invite) {
      return res.status(404).json({ success: false, message: 'Invite not found' });
    }

    if (invite.inviterUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to revoke this invite' });
    }

    invite.status = 'revoked';
    await invite.save();

    // If user accepted, unlink them
    const user = await User.findOne({ email: invite.inviteeEmail });
    if (user && user.parentAccount && user.parentAccount.toString() === req.user._id.toString()) {
      user.parentAccount = null;
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: invite,
    });
  } catch (error) {
    console.error('Error revoking invite:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
