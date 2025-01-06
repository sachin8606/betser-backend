const User = require('../../models/user.model');
const EmergencyContact = require('../../models/emergencyContact.model');

// Create a new user
exports.createUser = async (userData) => {
  return await User.create(userData, {
    include: [EmergencyContact], // Include emergency contacts if part of the creation
  });
};

// Find a user by filter (email, phone, etc.)
exports.findUser = async (filter) => {
  console.log(filter)
  return await User.findOne({
    where: filter,
    include: EmergencyContact, // You can include related emergency contacts if needed
  });
};

// Find a user by ID (excluding the password field)
exports.findUserById = async (id) => {
  return await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: EmergencyContact, // Include related emergency contacts if needed
  });
};

// Add an emergency contact to a user
exports.addEmergencyContactToUser = async (userId, contact) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Limit the number of emergency contacts to 5
  const emergencyContactsCount = await EmergencyContact.count({ where: { userId: user.id } });
  if (emergencyContactsCount >= 5) {
    throw new Error('Cannot add more than 5 emergency contacts');
  }

  const newContact = await EmergencyContact.create({
    ...contact,
    userId: user.id, // Associate the contact with the user
  });

  return newContact;
};

// Delete an emergency contact from a user
exports.deleteEmergencyContactFromUser = async (userId, contactId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const contact = await EmergencyContact.findOne({
    where: {
      userId: user.id,
      id: contactId,
    },
  });

  if (!contact) {
    throw new Error('Emergency contact not found');
  }

  await contact.destroy(); // Delete the contact
  return `Emergency contact with ID ${contactId} has been deleted`;
};

// Get all emergency contacts of a user
exports.getEmergencyContacts = async (userId) => {
  const user = await User.findByPk(userId, {
    include: EmergencyContact, // Include emergency contacts
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user.EmergencyContacts; // Return the associated emergency contacts
};
