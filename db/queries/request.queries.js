// queries/request.queries.js
const Request = require('../../models/request.model');

// Create a new request
exports.createRequest = async (requestData) => {
  console.log(requestData)
  return await Request.create(requestData);
};

// Get requests by user
exports.getRequestsByUser = async (userId) => {
  return await Request.findAll({ where: { userId } });
};

// Update request status
exports.updateRequestStatus = async (requestId, status) => {
  const [updatedRows, [updatedRequest]] = await Request.update(
    { status },
    {
      where: { id: requestId },
      returning: true,
    }
  );
  return updatedRequest;
};
