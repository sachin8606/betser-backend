const axios = require('axios');
const firebaseSdk = require('../config/firebase');
const { getAdminFcmToken } = require('../vars/vars');

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

const sendPushNotification = async ({title,message}) =>{
  try{
    const payload = {
      notification: {
        title,
        body: message,
      },
      token: getAdminFcmToken()
    };

    // ✅ Send the notification
    const response = await firebaseSdk.messaging().send(payload);
    console.log('Successfully sent message:', response);
  }catch(error){
    console.log(error)
  }
}

module.exports = {sendNotification,sendPushNotification};
