const twilio = require('twilio');
const nodemailer = require('nodemailer');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const mailEmail = process.env.MAIL_EMAIL;
const mailPw = process.env.MAIL_PASSCODE;
const client = twilio(accountSid, authToken);
const mailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",      // SMTP server
  port: 587,                   // Port (587 for TLS)
  secure: false,
  auth: {
    user: mailEmail,
    pass: mailPw
  },
});

const sendSMS = async (to, message) => {
  try {
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


const sendMail = async (to,subject, message) => {
  try {
    let mailOptions = {
      from: 'Behelp',
      to: to,
      subject: "",    
      text: message,
    };
    
    // send mail
    mailTransporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("Error occurred: ", error);
      }
      console.log("Message sent: %s", info.messageId);
      return info.messageId
    });
  } catch (error) {
    console.error('Error sending SMS:', error.message);
  }


};

module.exports = { sendSMS,sendMail };
