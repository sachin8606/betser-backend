const Request = require('../../models/request.model');

const createRequest = async (requestData) => await Request.create(requestData);

const getRequestsByUser = async (userId) => await Request.find({ user: userId });

const updateRequestStatus = async (requestId, status) => 
  await Request.findByIdAndUpdate(requestId, { status }, { new: true });

module.exports = {
  createRequest,
  getRequestsByUser,
  updateRequestStatus,
};
