const Admin = require('../../models/admin.model');
const User = require('../../models/user.model');
const Request = require('../../models/request.model');
const { Op } = require('sequelize');
const EmergencyContact = require('../../models/emergencyContact.model');
const { setAdminFcmToken } = require('../../vars/vars');

// Create Admin
exports.createAdmin = async (adminData) => {
  return await Admin.create(adminData);
};

// Find Admin by Email
exports.findAdminByEmail = async (email) => {
  return await Admin.findOne({ where: { email } });
};

// Find Admin by ID
exports.findAdminById = async (id) => {
  return await Admin.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
};

exports.updateAdmin = async (id, newData) => {
  const admin = await Admin.findByPk(id);

  if (!admin) {
    throw new Error('Admin not found');
  }
  if (newData?.fcm_token) {
    setAdminFcmToken(newData.fcm_token)
  }
  await admin.update(newData);
  return admin;
}


// Authenticate Admin
exports.authenticateAdmin = async (email, password) => {
  const admin = await Admin.findOne({ where: { email } });
  if (!admin || !(await admin.comparePassword(password))) {
    throw new Error('Invalid email or password');
  }
  return admin;
};

// Search Users
exports.searchUsers = async ({ filters = {}, page = 1, limit = 10 } = {}, full = false) => {
  const query = {};

  if (filters.searchKeyword) {
    query[Op.or] = [
      { phone: { [Op.iLike]: `%${filters.searchKeyword}%` } },
      { firstName: { [Op.iLike]: `%${filters.searchKeyword}%` } },
      { lastName: { [Op.iLike]: `%${filters.searchKeyword}%` } },
      { email: { [Op.iLike]: `%${filters.searchKeyword}%` } }
    ];
  }

  const offset = (page - 1) * limit;
  if (full) {
    const result = await User.findAll({
      where: query,
      attributes: ['firstName', 'lastName', 'nickName', 'phone', 'email', 'createdAt', 'id'],
    });
    console.log("result", result);
    return result
  }

  const result = await User.findAndCountAll({
    where: query,
    attributes: ['firstName', 'lastName', 'nickName', 'phone', 'email', 'createdAt', 'id'],
    limit,
    offset,
  });

  const totalRecords = await User.count({ where: query });

  return {
    totalPages: Math.ceil(result.count / limit),
    currentPage: page,
    users: result.rows,
    totalRecords
  };
}


// Get All Users
exports.getAllUsers = async ({ filter = {}, page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  const users = await User.findAll({
    where: filter,
    limit,
    offset,
  });

  const totalRecords = await User.count({ where: filter });

  return {
    totalPages: Math.ceil(totalRecords / limit),
    currentPage: page,
    users,
    totalRecords
  };
};

// Get User Details
exports.getUserDetails = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password', 'createdAt'] },
    include: EmergencyContact
  });
  if (!user) throw new Error('User not found');
  return user;
};

// Get Help Requests by User
exports.getHelpRequests = async (user) => {
  const requests = await Request.findAll({ where: { userId: user.id } });
  return requests;
};

// Get All Help Requests
exports.getAllHelpRequests = async (filter) => {
  return await Request.findAll({ where: filter });
};

// Acknowledge Help Request
exports.acknowledgeHelpRequest = async (requestId, adminId) => {
  const request = await Request.findByPk(requestId);
  if (!request) throw new Error('Help request not found');

  request.status = 'Resolved'; // Update status
  await request.save();
  return request;
};