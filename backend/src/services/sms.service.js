const twilio = require('twilio');

// Initialize Twilio client using environment variables
const createTwilioClient = () => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn('⚠️ Twilio credentials not found in env. SMS notifications are disabled.');
    return null;
  }
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

const sendSMS = async (to, body) => {
  const client = createTwilioClient();
  if (!client) return false;

  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to || process.env.SMS_TO_NUMBER || '+919076827270',
    });
    console.log('📱 SMS sent successfully:', message.sid);
    return true;
  } catch (error) {
    console.error('❌ Error sending SMS:', error);
    return false;
  }
};

const sendContactInquirySMS = async (inquiry) => {
  const messageBody = `Portfolio Alert ✉️\nName: ${inquiry.name}\nEmail: ${inquiry.email}\nSubject: ${inquiry.subject}\nMsg: ${inquiry.message.substring(0, 100)}${inquiry.message.length > 100 ? '...' : ''}`;
  
  return sendSMS(process.env.SMS_TO_NUMBER || '+919076827270', messageBody);
};

module.exports = {
  sendSMS,
  sendContactInquirySMS,
};
