const { createUser, findUserById, getEmergencyContacts, deleteEmergencyContactFromUser, findUser, addEmergencyContactsToUser, countEmergencyContacts, updateUserDetails } = require('../db/queries/user.queries');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { EMERGENCY_CONTACTS_ALERT } = require('../types');
const { deleteAlertsByType } = require('../db/queries/alert.queries');
const { where, fn, col, Op } = require('sequelize');
const { generateOtp } = require('../utils/math.utils');
const { sendSMS } = require('../services/sms.service');
const accountRegistrationOtp = require('../templates/sms.template');
const { returnUsers } = require('../utils/returnBody.utils');
const generateToken = (user) => {
  const payload = {
    id: user.id,
    role: user.role
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });
};

exports.registerUser = async (req, res) => {
  const { phone, countryCode } = req.body;

  try {
    const filterObj = {
      [Op.or]: [
        where(fn('CONCAT', col('countryCode'), col('phone')), `${countryCode}${phone}`)
      ]
    };

    const userExists = await findUser(filterObj);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const otp = generateOtp();
    await sendSMS(`+${countryCode}${phone}`, accountRegistrationOtp(otp))
    await createUser({ phone, countryCode, otp })
    return res.status(201).json({ message: 'Otp sent successfully.' });
  } catch (err) {
    console.error('Error in registerUser:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.verifyOtpRegistrationMobile = async (req, res) => {
  try {
    const { countryCode, phone, otp } = req.body;
    const user = await findUser({ countryCode, phone })
    if (user) {
      if (user.otp === otp) {
        await updateUserDetails(user.id, { isMobileVerified: true, otp: null })
        res.status(200).json({ "message": "otp verified","id":user.id })
      }
      else {
        res.status(400).json({ "message": "otp did not match!" })
      }
    }
    else {
      res.status(400).json({ "message": "User not found" })
    }
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
}

// verify Email
// exports.verifyEmail = async() => {
//   try{

//   }catch(err){
//     res.status(500).json({ message: 'Error', error: err.message });
//   }
// }

exports.loginUserMail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findUser({ email });
    if (user.isActive) {
      if (user) {
        const otp = generateOtp()
        await user.update({ otp })
        res.json({ otp: otp, message: 'otp generated' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Account not active.' });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateUserDetailsHandler = async (req, res) => {
  try {
    let { id, data, flag } = req.body;
    if (data.isActive) {
      return res.status(400).json({ "message": "error" })
    }
    if (flag === "registration") {
      data = { ...data, isActive: true }
    }
    const updatedUser = await updateUserDetails(id, data);
    res.status(200).json({ "message": "success", "user": updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

exports.loginUserMobile = async (req, res) => {
  const { countryCode, phone } = req.body;

  try {
    const filterObj = {
      [Op.or]: [
        where(fn('CONCAT', col('countryCode'), col('phone')), `${countryCode}${phone}`)
      ]
    };
    const user = await findUser(filterObj);
    if (user) {
      if (user.isActive) {
        const otp = generateOtp()
        await sendSMS(`+${countryCode}${phone}`, accountRegistrationOtp(otp))
        await user.update({ otp })
        res.json({ otp: otp, message: 'otp generated' });
      }
      else {
        res.status(401).json({ message: 'Account not active.', id: user.id });
      }
    }
    else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const {countryCode, phone, otp } = req.body;
  try {
    const filterObj = {
      [Op.or]: [
        where(fn('CONCAT', col('countryCode'), col('phone')), `${countryCode}${phone}`)
      ]
    };
    const user = await findUser(filterObj);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.otp === otp) {
      user.otp = null
      await user.update()
      return res.status(200).json({ message: 'success', token: generateToken(user),user: returnUsers(user) });
    } else {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  } catch (err) {
    res.json(500).json({ message: 'Server error', error: err.message })
  }
}

exports.addEmergencyContacts = async (req, res) => {
  const contacts = req.body.contacts; // Expecting an array of contacts [{ name, phone }, ...]
  const userId = req.user.id;

  try {
    const updatedContacts = await addEmergencyContactsToUser(userId, contacts);
    const contactCount = await countEmergencyContacts({ where: { userId } });
    if (contactCount >= 5) {
      await deleteAlertsByType(userId, EMERGENCY_CONTACTS_ALERT);
    }
    res.status(201).json({ message: "Emergency contacts added", data: updatedContacts });
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
    res.json({ contacts: contacts, message: 'Emergency contacts retrieved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
