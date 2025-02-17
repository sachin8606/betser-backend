const { createRequest, fetchRequests, updateRequestStatus } = require('../db/queries/request.queries');
const { sendPushNotification } = require('../utils/notification.utils');
const {createNotification}  = require('../db/queries/notification.queries')

exports.createRequest = async (req, res) => {
  try {
    const {id} = req.user
    const { type, description } = req.body;
    if (!id || !type || !description) {
      return res.status(400).json({ message: 'All fields are required: userId, type, and details.' });
    }

    const request = await createRequest({ userId:id, type, description });
    sendPushNotification({title:`New Request - ${type}`,message:description})
    await createNotification({"userId":id,"title":type+" request",message:description})
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
