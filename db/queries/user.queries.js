const User = require('../../models/user.model');
const EmergencyContact = require('../../models/emergencyContact.model');

exports.createUser = async (userData) => {
  return await User.create(userData, {
    include: [EmergencyContact],
  });
};

exports.findUser = async (filter) => {
  return await User.findOne({
    where: filter,
    attributes: { exclude: ['password'] }
  });
};

exports.updateUserDetails = async (userId, updatedData) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  await user.update(updatedData);
  return user;
};

exports.findUserById = async (id) => {
  return await User.findByPk(id, {
    attributes: { exclude: ['password','otp'] },
    include: EmergencyContact,
  });
};

exports.addEmergencyContactsToUser = async (userId, contacts) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const emergencyContactsCount = await EmergencyContact.count({ where: { userId } });

  if (emergencyContactsCount + contacts.length > 5) {
    throw new Error('Cannot add more than 5 emergency contacts');
  }

  const newContacts = await EmergencyContact.bulkCreate(
    contacts.map((contact) => ({ ...contact, userId })),
    { returning: true }
  );

  return newContacts;
};

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

  await contact.destroy(); 
  return `Emergency contact with mobile number ${contact.phone} has been deleted`;
};

exports.getEmergencyContacts = async (userId) => {
  const user = await User.findByPk(userId, {
    include: EmergencyContact,
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user.EmergencyContacts; 
};

exports.countEmergencyContacts = async (filter) => {
  return await EmergencyContact.count(filter)
}

exports.deleteUser = async(id) => {
  return await User.destroy({where:{id}});
}
