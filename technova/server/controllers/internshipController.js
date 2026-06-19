import InternshipListing from '../models/InternshipListing.js';
import InternshipApplication from '../models/InternshipApplication.js';

// @desc    Get all active internship listings
// @route   GET /api/v1/internships
// @access  Public
export const getInternships = async (req, res, next) => {
  try {
    const { department, mode, search, sort = '-createdAt', page = 1, limit = 12 } = req.query;
    
    const query = { status: 'Active' };

    if (department) query.department = department;
    if (mode) query.mode = mode;
    if (search) query.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    
    let sortObj = { createdAt: -1 };
    if (sort === 'deadline') sortObj = { deadline: 1 };

    const [internships, total] = await Promise.all([
      InternshipListing.find(query)
        .populate('client', 'name company')
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit)),
      InternshipListing.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: internships.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: internships,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single internship by ID
// @route   GET /api/v1/internships/:id
// @access  Public
export const getInternshipById = async (req, res, next) => {
  try {
    const internship = await InternshipListing.findById(req.params.id)
      .populate('client', 'name company');

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found',
      });
    }

    res.json({
      success: true,
      data: internship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply to an internship
// @route   POST /api/v1/internships/:id/apply
// @access  Private
export const applyToInternship = async (req, res, next) => {
  try {
    const internship = await InternshipListing.findById(req.params.id);
    
    if (!internship || internship.status !== 'Active') {
      return res.status(404).json({
        success: false,
        message: 'Internship is not active or not found',
      });
    }

    // Check if already applied
    const existingApp = await InternshipApplication.findOne({ 
      internship: internship._id, 
      applicant: req.user._id 
    });

    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this internship',
      });
    }

    const application = await InternshipApplication.create({
      ...req.body,
      internship: internship._id,
      applicant: req.user._id,
    });

    // Send email notification to admin
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_USER || '"Tarkko Notifications" <noreply@tarkkosolutions.com>',
        to: process.env.SMTP_USER || 'kunalekare02@gmail.com',
        subject: `New Internship Application: ${internship.title}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #4f46e5; background-image: linear-gradient(to right, #4f46e5, #3b82f6); color: #ffffff; padding: 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">Tarkko Internships</h1>
            </div>
            <div style="padding: 32px; background-color: #ffffff; color: #1f2937;">
              <h2 style="margin-top: 0; color: #111827; font-size: 20px; font-weight: 600; border-bottom: 2px solid #f3f4f6; padding-bottom: 12px;">New Internship Application Received</h2>
              
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 12px 16px; border-radius: 6px; margin: 20px 0; font-weight: 500;">
                Internship: ${internship.title}
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 15px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; width: 140px;"><strong style="color: #4b5563;">Candidate:</strong></td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${req.user.name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong style="color: #4b5563;">Email:</strong></td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><a href="mailto:${req.user.email}" style="color: #4f46e5; text-decoration: none; font-weight: 500;">${req.user.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong style="color: #4b5563;">Phone:</strong></td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${req.body.phone || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong style="color: #4b5563;">College/University:</strong></td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${req.body.universityName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong style="color: #4b5563;">Major/Degree:</strong></td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${req.body.majorOrDegree || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong style="color: #4b5563;">Links:</strong></td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                    ${req.body.linkedInUrl ? `<a href="${req.body.linkedInUrl}" style="color: #4f46e5; margin-right: 12px;">LinkedIn</a>` : ''}
                    ${req.body.githubOrPortfolioUrl ? `<a href="${req.body.githubOrPortfolioUrl}" style="color: #4f46e5;">Portfolio/GitHub</a>` : ''}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong style="color: #4b5563;">Resume:</strong></td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><a href="${req.body.resumeUrl}" style="color: #4f46e5; text-decoration: none; font-weight: 500;">View Resume Document &rarr;</a></td>
                </tr>
              </table>

              <div style="margin-top: 28px;">
                <h3 style="margin-bottom: 12px; color: #374151; font-size: 16px; font-weight: 600;">Cover Letter / Notes</h3>
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #f3f4f6; font-style: italic; color: #4b5563; line-height: 1.6;">
                  ${req.body.coverLetter ? req.body.coverLetter.replace(/\n/g, '<br/>') : 'No cover letter provided.'}
                </div>
              </div>
              
              <div style="margin-top: 32px; text-align: center;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/internships" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Review Application</a>
              </div>
            </div>
            
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0;">This is an automated notification from the Tarkko platform.</p>
              <p style="margin: 6px 0 0 0;">&copy; ${new Date().getFullYear()} Tarkko Solutions. All rights reserved.</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email notification failed to send:', emailError);
    }

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my internship applications
// @route   GET /api/v1/internships/my-applications
// @access  Private
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await InternshipApplication.find({ applicant: req.user._id })
      .populate('internship', 'title company department duration stipend mode status')
      .sort('-createdAt');

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create an internship listing (Admin)
// @route   POST /api/v1/internships
// @access  Private/Admin
export const createInternship = async (req, res, next) => {
  try {
    const internship = await InternshipListing.create(req.body);

    res.status(201).json({
      success: true,
      data: internship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an internship listing (Admin)
// @route   PUT /api/v1/internships/:id
// @access  Private/Admin
export const updateInternship = async (req, res, next) => {
  try {
    let internship = await InternshipListing.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found',
      });
    }

    internship = await InternshipListing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: internship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Close an internship listing (Admin)
// @route   DELETE /api/v1/internships/:id
// @access  Private/Admin
export const deleteInternship = async (req, res, next) => {
  try {
    const internship = await InternshipListing.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found',
      });
    }

    // Instead of deleting, just set status to 'Closed'
    internship.status = 'Closed';
    await internship.save();

    res.json({
      success: true,
      data: internship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all internship applications (Admin)
// @route   GET /api/v1/internships/admin/applications
// @access  Private/Admin
export const getAllApplications = async (req, res, next) => {
  try {
    const applications = await InternshipApplication.find()
      .populate('internship', 'title department status')
      .populate('applicant', 'name email avatar')
      .sort('-createdAt');

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update internship application status (Admin)
// @route   PUT /api/v1/internships/admin/applications/:id/status
// @access  Private/Admin
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, adminFeedback } = req.body;

    const application = await InternshipApplication.findById(req.params.id)
      .populate('applicant', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    application.status = status;
    if (adminFeedback) application.adminFeedback = adminFeedback;
    
    await application.save();

    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};
