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
    updateUserDetails,
    findAdminById,
} = require('../db/queries/admin.queries');
const jwt = require('jsonwebtoken');
const XLSX = require('xlsx');
const generateToken = (user) => {
    const payload = {
        id: user.id,
        role: user.role
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });
};



// Admin login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await authenticateAdmin(email, password);
        res.status(200).json({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            token: generateToken(admin),
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Register new admin
exports.register = async (req, res) => {
    try {
        const admin = await createAdmin(req.body);
        if(admin){
            res.status(201).json({ message: 'Admin created successfully' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get admin details
exports.getAdminDetails = async (req, res) => {
    try {
        const { id } = req.user;
        const admin = await findAdminById(id);
        if(admin){
            return res.status(200).json(admin);
        }
        return res.status(200).json(admin);
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

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
        const filter = req.body.filter || {};
        const users = await searchUsers(filter);
        if (users.length === 0) {
            throw new Error('No users found with the applied filters.');
        }
        // Prepare the data for the Excel file
        const columns = ['First Name', 'Last Name', 'Nickname', 'Phone', 'Email', 'Created At', 'ID'];
        const data = users.map((user) => [
            user.firstName,
            user.lastName,
            user.nickName,
            user.phone,
            user.email,
            user.createdAt.toISOString(),
            user.id,
        ]);
        const workbook = XLSX.utils.book_new();
        const worksheetData = [columns, ...data];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users')
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
        // Set the appropriate headers
        res.setHeader('Content-Disposition', 'attachment; filename="users_export.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');;
        res.status(200).send(buffer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update user details
exports.updateUserDetailsHandler = async (req, res) => {
    try {
        const { id, data } = req.body;
        const updatedUser = await updateUserDetails(id, data);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Get user details
exports.getUserDetailsHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const userDetails = await getUserDetails(id);
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
        const filter = req.body.filter || {};
        const helpRequests = await getAllHelpRequests(filter);
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