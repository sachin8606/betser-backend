const { createUser, findUserById, addEmergencyContactToUser, getEmergencyContacts, deleteEmergencyContactFromUser, findUser } = require('../db/queries/user.queries');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
  const payload = {
    id: user.id,
    role: user.role
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });
};

exports.registerUser = async (req, res) => {
  const { firstName, lastName, nickName, email, password, phone } = req.body;

  try {
    const userExists = await findUser({email});
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await createUser({ firstName, lastName,nickName, password, phone,email });
    res.status(201).json({user:{
      firstName: user.firstName,
      lastName: user.lastName,
      nickName: user.nickName,
      email: user.email,
      phone: user.phone,
    },token: generateToken(user), message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.loginUserMail = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUser({email});
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ token: generateToken(user), message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.loginUserMobile = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await findUser({phone});
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ token: generateToken(user), message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addEmergencyContact = async (req, res) => {
  const { name, phone } = req.body;
  const userId = req.user.id;
  try {
    const updatedContacts = await addEmergencyContactToUser(userId, { name, phone });
    res.status(201).json({ message: "Emergency contact added", data: updatedContacts });
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
    res.json({contacts: contacts, message: 'Emergency contacts retrieved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
