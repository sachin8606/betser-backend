// queries/request.queries.js
const { Op } = require('sequelize');
const Request = require('../../models/request.model');
const User = require('../../models/user.model');
// Create a new request
exports.createRequest = async (requestData) => {
  return await Request.create(requestData);
};

// Get requests by user
exports.fetchRequests = async ({ filters = {}, page = 1, limit = 10 } = {}) => {
  const offset = (page - 1) * limit;
  const query = {};

  if (filters.searchKeyword) {
    query[Op.or] = [
      { description: { [Op.iLike]: `%${filters.searchKeyword}%` } },
      { '$User.firstName$': { [Op.iLike]: `%${filters.searchKeyword}%` } },
      { '$User.lastName$': { [Op.iLike]: `%${filters.searchKeyword}%` } }
    ];
  }

  if (filters.status) {

    query["status"] = filters.status;
  }
  const result = await Request.findAndCountAll({
    where: query,
    include: {
      model: User,
      attributes: ['firstName', 'lastName', 'countryCode', 'phone'],
    },
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });

  return {
    totalPages: Math.ceil(result.count / limit),
    currentPage: page,
    data: result.rows,
    totalRecords:result.count
  };
};

// Update request status
exports.updateRequestStatus = async (requestId, newData) => {
  const request = await Request.findByPk(requestId);
  if (!request) {
    throw new Error('Request not found.')
  }
  await request.update(newData);
  return request;
};
