const {
    createAdmin,
    findAdminByEmail,
    authenticateAdmin,
    searchUsers,
    getAllUsers,
    getUserDetails,
    logCommunication,
    sendNotificationOrMessage,
    getAllHelpRequests,
    acknowledgeHelpRequest,
} = require('../db/queries/admin.queries');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });
};



// Admin login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await authenticateAdmin(email, password);

        const token = generateToken(admin);
        res.status(200).json({ token, admin });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Register new admin
exports.register = async (req, res) => {
   try {
        const admin = await createAdmin(req.body);
        res.status(201).json({ message: 'Admin created successfully', admin });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Search users
exports.searchUsersHandler = async (req, res) => {
    try {
        const users = await searchUsers(req.query);
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Export users as CSV
exports.exportUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        const csv = users.map((user) => `${user.name},${user.phone}`).join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
        res.send(csv);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get user details
exports.getUserDetailsHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const userDetails = await getUserDetails(phone);
        res.status(200).json(userDetails);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Send notification or message
exports.sendNotification = async (req, res) => {
    try {
        const { sender, receiver, message, type, mediaUrl } = req.body;
        const log = await sendNotificationOrMessage({
            sender,
            receiver,
            message,
            type,
            mediaUrl,
        });
        res.status(200).json({ message: 'Notification sent', log });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get help requests
exports.getHelpRequests = async (req, res) => {
    try {
        const helpRequests = await getAllHelpRequests();
        res.status(200).json(helpRequests);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Acknowledge help request
exports.acknowledgeHelpRequestHandler = async (req, res) => {
    try {
        const { requestId } = req.body;
        const { id: adminId } = req.user;

        const request = await acknowledgeHelpRequest(requestId, adminId);
        res.status(200).json({ message: 'Help request acknowledged', request });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};