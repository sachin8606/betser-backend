const { sendSMS, sendMail } = require("../services/sms.service");

const sendBulkSms = async(numbers,message) =>{
    try{
       numbers.forEach(async(contact) => {
        await sendSMS(contact,message);
       });
    }catch(err){
        console.log(err)
    }
}

const sendBulkMails = (mails,subject,message) => {
    try{
        mails.forEach(mail => {
            sendMail(mail,subject,message);
        })
    }catch(err){
        console.log(err)
    }
}

module.exports = {sendBulkMails, sendBulkSms}