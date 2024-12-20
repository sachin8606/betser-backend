const User = require('../../models/user.model');

exports.createUser = async (userData) => {
  return await User.create(userData);
};
exports.findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

exports.findUserById = async (id) => {
  return await User.findById(id);
};

exports.addEmergencyContactToUser = async (userId, contact) => {
  const user = await User.findById(userId);
  console.log(user)
  if (user && user.emergencyContacts && user.emergencyContacts.length >= 5) {
    throw new Error('Cannot add more than 5 emergency contacts');
  }

  user.emergencyContacts.push(contact);
  await user.save();
  return user.emergencyContacts;
};


exports.deleteEmergencyContactFromUser = async (userId, contactId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const contactIndex = user.emergencyContacts.findIndex(
    (contact) => contact._id.toString() === contactId
  );

  if (contactIndex === -1) {
    throw new Error('Emergency contact not found');
  }
  user.emergencyContacts.splice(contactIndex, 1);
  await user.save();
  return user.emergencyContacts;
};


exports.getEmergencyContacts = async (userId) => {
  const user = await User.findById(userId).select('emergencyContacts');
  return user.emergencyContacts;
};
