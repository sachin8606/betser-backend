const { createUser, getEmergencyContacts, deleteEmergencyContactFromUser, findUser, addEmergencyContactsToUser, countEmergencyContacts, updateUserDetails, findUserById, deleteUser } = require('../db/queries/user.queries');
const jwt = require('jsonwebtoken');
const { TRUSTED_CONTACTS_ALERT } = require('../types');
const { deleteAlertsByType } = require('../db/queries/alert.queries');
const { where, fn, col, Op } = require('sequelize');
const { generateOtp } = require('../utils/math.utils');
const { sendSMS, sendMail } = require('../services/sms.service');
const { returnUsers } = require('../utils/returnBody.utils');
const { createDeletedUser } = require('../db/queries/deletedUsers.queries');
const { accountRegistrationOtp, addTrustedContactTemplate, loginOtpTemplate } = require('../templates/sms.template')
const generateToken = (user) => {
  const payload = {
    id: user.id,
    role: user.role
  };
  return jwt.sign(payload, process.env.JWT_SECRET);
};

exports.registerUser = async (req, res) => {
  const { phone, countryCode, email,firstName, lastName } = req.body;

  try {
  
    const phoneUser = await findUser({
      [Op.and]: where(fn('CONCAT', col('countryCode'), col('phone')), `${countryCode}${phone}`)
    });
    

    if (email) {
      const emailUser = await findUser({ email });

      // If email exists on a different user
      if (emailUser && (!phoneUser || emailUser.id !== phoneUser.id)) {
        return res.status(400).json({ message: 'Email already exists with another user' });
      }
    }

    if (phoneUser && phoneUser.isActive) {
      return res.status(400).json({ message: 'Phone number already exists' });
    }

    
    const otp = generateOtp();
    await sendSMS(`+${countryCode}${phone}`, accountRegistrationOtp(otp,firstName+" "+lastName));
    await sendMail(email,"OTP for behelp registration", accountRegistrationOtp(otp,firstName+" "+lastName))

    if (phoneUser && !phoneUser.isActive) {
      await updateUserDetails(phoneUser.id, { otp });
      return res.status(200).json({ message: 'Otp sent successfully.' });
    }

    await createUser({ phone, countryCode, otp, email });
    return res.status(200).json({ message: 'Otp sent successfully.' });

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
        res.status(200).json({ "message": "otp verified", "id": user.id })
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
    res.status(200).json({ "message": "success", "user": updatedUser, "token": generateToken(updatedUser) });
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
        await sendSMS(`+${countryCode}${phone}`, loginOtpTemplate(otp,user.firstName+" "+user.lastName))
        await sendMail(user.email, 'Otp for behelp login', loginOtpTemplate(otp,user.firstName+" "+user.lastName))
        await user.update({ otp })
        res.json({ message: 'otp generated' });
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
  const { countryCode, phone, otp } = req.body;
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
      return res.status(200).json({ message: 'success', token: generateToken(user), user: returnUsers(user) });
    } else {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  } catch (err) {
    res.json(500).json({ message: 'Server error', error: err.message })
  }
}

exports.deleteUserFun = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    const userCopy = user;
    if (!user) {
      throw new Error("User not found")
    }
    const createdDeletedUser = await createDeletedUser(userCopy.toJSON());
    if (!createDeletedUser) {
      throw new Error("Failed")
    }
    const deletedCount = await deleteUser(req.user.id)
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
}

exports.addEmergencyContacts = async (req, res) => {
  const contacts = req.body.contacts;
  const userId = req.user.id;

  try {
    if (contacts && contacts.length > 0) {
      const updatedContacts = await addEmergencyContactsToUser(userId, contacts);
      const contactCount = await countEmergencyContacts({ where: { userId } });
      const user = await findUserById(userId);
      if (user) {
        const username = user.firstName + " " + user.lastName;
        const userMobile = "+" + user.countryCode + " " + user.phone;
        if (contactCount >= 1) {
          console.log(userId, TRUSTED_CONTACTS_ALERT)
          await deleteAlertsByType(userId, TRUSTED_CONTACTS_ALERT);
        }

        contacts.map(async (item, index) => {
          await sendSMS(`+${item.phone}`, addTrustedContactTemplate(username, userMobile))
        })
        res.status(201).json({ message: "Emergency contacts added", data: updatedContacts });
      }
      else {
        res.status(400).json({ message: "User not found." });
      }

    }
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
