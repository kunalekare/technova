import OrganizationBranding from '../models/OrganizationBranding.js';

export const getMyBranding = async (req, res) => {
  try {
    // If the user has a parentAccount, fetch the parent's branding.
    // Otherwise, fetch their own branding.
    const userId = req.user.parentAccount ? req.user.parentAccount : req.user._id;

    const branding = await OrganizationBranding.findOne({ user: userId });

    res.status(200).json({
      success: true,
      data: branding, // Will be null if no branding exists, which is fine (default styling)
    });
  } catch (error) {
    console.error('Error fetching branding:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

export const updateMyBranding = async (req, res) => {
  try {
    const { companyName, logoUrl, primaryColor, secondaryColor } = req.body;

    // Sub-users cannot update branding
    if (req.user.parentAccount) {
      return res.status(403).json({
        success: false,
        message: 'Only primary account holders can update branding',
      });
    }

    let branding = await OrganizationBranding.findOne({ user: req.user._id });

    if (branding) {
      // Update
      branding.companyName = companyName || branding.companyName;
      branding.logoUrl = logoUrl || branding.logoUrl;
      branding.primaryColor = primaryColor || branding.primaryColor;
      branding.secondaryColor = secondaryColor || branding.secondaryColor;
      await branding.save();
    } else {
      // Create
      branding = await OrganizationBranding.create({
        user: req.user._id,
        companyName,
        logoUrl,
        primaryColor,
        secondaryColor,
      });
    }

    res.status(200).json({
      success: true,
      data: branding,
    });
  } catch (error) {
    console.error('Error updating branding:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
