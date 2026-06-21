/**
 * Wrapper for calendar integrations (e.g. Google Calendar, Calendly, Zoom).
 * For now, returns a dummy meeting link.
 */

export const generateMeetingLink = async (bookingDetails) => {
  // In the future, call Google Calendar API or Zoom API here.
  // We use Jitsi Meet for mock calls because it automatically creates valid rooms for any random string.
  const randomId = Math.random().toString(36).substring(2, 12);
  return `https://meet.jit.si/TechNovaConsultation-${randomId}`;
};
