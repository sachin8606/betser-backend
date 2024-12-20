const axios = require('axios');

const sendNotification = async ({ message, to }) => {
  try {
    const response = await axios.post('https://sms-provider-api.com/send', {
      to,
      message,
    });
    console.log('Notification sent:', response.data);
    return true;
  } catch (err) {
    console.error('Error sending notification:', err.message);
    return false;
  }
};

module.exports = sendNotification;
