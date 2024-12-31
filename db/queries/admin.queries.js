const Admin = require('../../models/admin.model');
const User = require('../../models/user.model');
const Request = require('../../models/request.model');


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
  return await Admin.findByPk(id);
};

// Authenticate Admin
exports.authenticateAdmin = async (email, password) => {
  const admin = await Admin.findOne({ where: { email } });
  if (!admin || !(await admin.comparePassword(password))) {
    throw new Error('Invalid email or password');
  }
  return admin;
};

// Search Users
exports.searchUsers = async (filters) => {
  const query = {};
  if (filters.phone) query.phone = { [Op.iLike]: `%${filters.phone}%` }; // Case-insensitive search for phone
  if (filters.firstName) query.name = { [Op.iLike]: `%${filters.firstName}%` }; // Case-insensitive search for name

  return await User.findAll({
    where: query,
    attributes: ['firstName','lastName','nickName','phone', 'email', 'createdAt','id'],
  });
};

// Update User Details
exports.updateUserDetails = async (userId, updatedData) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  await user.update(updatedData); // Use Sequelize's `update` method
  return user;
};

// Get All Users
exports.getAllUsers = async (filter) => {
  return await User.findAll({ where: filter });
};

// Get User Details
exports.getUserDetails = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password', 'createdAt'] }, // Exclude these attributes
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
