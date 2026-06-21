import ConsultationBooking from '../models/ConsultationBooking.js';
import { generateMeetingLink } from '../services/calendar/calendarService.js';

export const createBooking = async (req, res, next) => {
  try {
    const { teamMember, scheduledAt, notes } = req.body;
    
    // Generate a mock meeting link
    const meetingLink = await generateMeetingLink({ teamMember, scheduledAt });

    const newBooking = await ConsultationBooking.create({
      client: req.user.id,
      teamMember,
      scheduledAt,
      meetingLink,
      notes
    });

    res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await ConsultationBooking.find({ client: req.user.id })
      .populate('teamMember', 'name email avatar')
      .sort('-scheduledAt');
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await ConsultationBooking.find()
      .populate('client', 'name email avatar')
      .populate('teamMember', 'name email avatar')
      .sort('-scheduledAt');
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};
