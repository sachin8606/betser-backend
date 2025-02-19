const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendSMS = async (to, message) => {
  try {
    console.log(to,message)
    const response = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to
    });
    console.log(`Message sent with SID: ${response.sid}`);
    return response.sid;
  } catch (error) {
    console.error('Error sending SMS:', error.message);
    throw error;
  }
};

module.exports = {sendSMS};
