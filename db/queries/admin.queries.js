const Admin = require('../../models/admin.model');
const User = require('../../models/user.model');
const Request = require('../../models/request.model');
const CommunicationLog = require('../../models/communicationLog.model');

const createAdmin = async (adminData) => {
  return await Admin.create(adminData);
};
const findAdminByEmail = async (email) => {
  return await Admin.findOne({ email });
};

const findAdminById = async (id) => {
  return await Admin.findById(id);
};

const authenticateAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.comparePassword(password))) {
    throw new Error('Invalid email or password');
  }
  return admin;
};

const searchUsers = async (filters) => {
  const query = {};
  if (filters.phone) query.phone = { $regex: filters.phone, $options: 'i' };
  if (filters.name) query.name = { $regex: filters.name, $options: 'i' };

  return await User.find(query);
};


const getAllUsers = async () => {
  return await User.find({});
};

const getUserDetails = async (id) => {
  const user = await User.findById(id).populate('emergencyContacts');
  if (!user) throw new Error('User not found');

  const requests = await Request.find({ user: user._id });
  return { user, requests };
};

const logCommunication = async (data) => {
  return await CommunicationLog.create(data);
};

const sendNotificationOrMessage = async (logData) => {
  return await CommunicationLog.create(logData);
};

const getAllHelpRequests = async () => {
  return await Request.find({}).populate('user');
};

const acknowledgeHelpRequest = async (requestId, adminId) => {
  const request = await Request.findById(requestId);
  if (!request) throw new Error('Help request not found');

  request.status = 'Resolved';
  await request.save();
  return request;
};

module.exports = {
  createAdmin,
  findAdminByEmail,
  findAdminById,
  authenticateAdmin,
  searchUsers,
  getAllUsers,
  getUserDetails,
  logCommunication,
  sendNotificationOrMessage,
  getAllHelpRequests,
  acknowledgeHelpRequest,
};
