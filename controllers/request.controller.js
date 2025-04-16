const { createRequest, fetchRequests, updateRequestStatus } = require('../db/queries/request.queries');
const { sendPushNotification } = require('../utils/notification.utils');
const {createNotification}  = require('../db/queries/notification.queries');
const { getEmergencyContacts, findUserById } = require('../db/queries/user.queries');
const { sendBulkSms } = require('../utils/sms.utils');

const generateRequestId = (reqType) => { 
  const prefix = reqType.substring(0, 3).toUpperCase(); 
  const randomNumber = Math.floor(100000 + Math.random() * 900000); 
  return `${prefix}-${randomNumber}`;
};

exports.createRequest = async (req, res) => {
  try {
    const {id} = req.user
    const request = await createRequest({"id":generateRequestId(req.body.type), "userId":id, ...req.body });
    sendPushNotification({title:`New Request - ${req.body.type}`,message:req.body.description})
    await createNotification({"userId":id,"title":req.body.type+" request",message:req.body.description})
    const user = await findUserById(id);
    if(user){
      const phoneNumbers = user?.EmergencyContacts?.map(c => 
        `+${c.phone}`
      ) || [];
      const locationPart = req?.body?.description.split('Location -')[1]?.trim();
      const msg = `${user?.firstName} ${user?.lastName} needs help ${user?.countryCode}${user?.phone}, ${locationPart}`
      await sendBulkSms(phoneNumbers,msg)
    }

    res.status(201).json({ message: 'Request created successfully', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const filter = req.body
    const requests = await fetchRequests(filter);
    res.status(200).json({ message: 'Requests fetched successfully', requests });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const {id, data} = req.body
    const requests = await updateRequestStatus(id,data);
    res.status(200).json({ message: 'Requests updated successfully', requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
