/**
 * Email templates for the referral program.
 * In a real application, this would use a mailer service like Nodemailer or Resend.
 */

export const sendReferralInvite = async (refereeEmail, referrerName, signupLink) => {
  // Mock email send
  console.log(`[Email Service] Sending referral invite to ${refereeEmail}`);
  console.log(`[Email Service] Subject: ${referrerName} invited you to TechNova Solutions!`);
  console.log(`[Email Service] Body: Sign up here to get started: ${signupLink}`);
  return true;
};
