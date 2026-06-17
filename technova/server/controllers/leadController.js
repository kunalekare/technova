import Lead from '../models/Lead.js';
import nodemailer from 'nodemailer';

// @desc    Create a new lead (public)
// @route   POST /api/v1/leads
// @access  Public
export const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, company, requirement, source } = req.body;

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      requirement,
      source: source || 'website',
    });

    // Attempt to send email notification to admin
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_USER || '"Velixora Notifications" <noreply@velixorasolutions.com>',
        to: 'kunalekare02@gmail.com',
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #4f46e5; background-image: linear-gradient(to right, #4f46e5, #3b82f6); color: #ffffff; padding: 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">Velixora Solutions</h1>
            </div>
            <div style="padding: 32px; background-color: #ffffff; color: #1f2937;">
              <h2 style="margin-top: 0; color: #111827; font-size: 20px; font-weight: 600; border-bottom: 2px solid #f3f4f6; padding-bottom: 12px;">New Contact Form Submission</h2>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 15px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; width: 120px;"><strong style="color: #4b5563;">Name:</strong></td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong style="color: #4b5563;">Email:</strong></td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><a href="mailto:${email}" style="color: #4f46e5; text-decoration: none; font-weight: 500;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong style="color: #4b5563;">Phone:</strong></td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${phone || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong style="color: #4b5563;">Company:</strong></td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${company || 'Not provided'}</td>
                </tr>
              </table>

              <div style="margin-top: 28px;">
                <h3 style="margin-bottom: 12px; color: #374151; font-size: 16px; font-weight: 600;">Requirement Details</h3>
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #f3f4f6; font-style: italic; color: #4b5563; line-height: 1.6;">
                  ${requirement.replace(/\n/g, '<br/>')}
                </div>
              </div>
              
              <div style="margin-top: 32px; text-align: center;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/leads" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">View in Admin Dashboard</a>
              </div>
            </div>
            
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0;">This is an automated notification from the Velixora platform.</p>
              <p style="margin: 6px 0 0 0;">&copy; ${new Date().getFullYear()} Velixora Solutions. All rights reserved.</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email notification failed to send:', emailError);
      // We don't fail the lead creation if email fails
    }

    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leads (Kanban board)
// @route   GET /api/v1/leads
// @access  Private/Admin
export const getLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find().sort('-createdAt');

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead status
// @route   PUT /api/v1/leads/:id/status
// @access  Private/Admin
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Communicate with Lead (Add Note or Send Email)
// @route   POST /api/v1/leads/:id/communicate
// @access  Private/Admin
export const communicateWithLead = async (req, res, next) => {
  try {
    const { type, message } = req.body;
    const leadId = req.params.id;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const isEmail = type === 'email';

    // If it's an email, send it via nodemailer
    if (isEmail && lead.email) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const mailOptions = {
          from: process.env.SMTP_USER || '"Velixora Notifications" <noreply@velixorasolutions.com>',
          to: lead.email,
          subject: 'Update regarding your inquiry with Velixora',
          html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <div style="background-color: #4f46e5; background-image: linear-gradient(to right, #4f46e5, #3b82f6); color: #ffffff; padding: 24px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">Velixora Solutions</h1>
              </div>
              <div style="padding: 32px; background-color: #ffffff; color: #1f2937;">
                <p style="font-size: 16px; color: #374151;">Hi ${lead.name},</p>
                
                <div style="margin: 24px 0; padding: 20px; background-color: #f9fafb; border-left: 4px solid #4f46e5; border-radius: 4px; font-size: 15px; line-height: 1.6; color: #1f2937;">
                  ${message.replace(/\n/g, '<br/>')}
                </div>
                
                <p style="margin-top: 32px; font-size: 15px; color: #4b5563;">
                  Best Regards,<br/>
                  <strong style="color: #111827;">The Velixora Team</strong>
                </p>
              </div>
              <div style="background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} Velixora Solutions. All rights reserved.</p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Failed to send email to lead:', emailError);
        return res.status(500).json({ success: false, message: 'Failed to send email. Check SMTP settings.' });
      }
    }

    // Save to notes array
    lead.notes.push({
      text: message,
      isEmail,
      addedBy: req.user._id,
    });

    await lead.save();

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};
