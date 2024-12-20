const { createUser, findUserByEmail, findUserById, addEmergencyContactToUser, getEmergencyContacts, deleteEmergencyContactFromUser } = require('../db/queries/user.queries');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });
};



exports.registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const userExists = await findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await createUser({ name, email, password, phone });
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.addEmergencyContact = async (req, res) => {
  const { name, phone } = req.body;
  const userId = req.user.id;
  console.log(req.user, name, phone,)
  try {
    const updatedContacts = await addEmergencyContactToUser(userId, { name, phone });
    res.status(201).json({message:"Emergency contact added",data:updatedContacts});
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteEmergencyContact = async (req, res) => {
  const { contactId } = req.body;
  const userId = req.user.id;

  try {
    const updatedContacts = await deleteEmergencyContactFromUser(userId, contactId);
    res.status(200).json({ message: 'Emergency contact deleted', contacts: updatedContacts });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.getEmergencyContacts = async (req, res) => {
  const userId = req.user.id;
  try {
    const contacts = await getEmergencyContacts(userId);
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
