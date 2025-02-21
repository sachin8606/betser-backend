const {
    createAlert,
    getUserAlerts,
    findAlertById,
    upsertAlert,
    deleteAlertsByType,
    markAlertAsRead,
    deleteAlertById,
    getAllAlerts
  } = require('../db/queries/alert.queries');
  
  exports.createAlert = async (req, res) => {
    try {
      const { userId, type, message } = req.body;
      if (!userId || !type || !message) {
        return res.status(400).json({ message: 'All fields are required: userId, type, and message.' });
      }
  
      const alert = await createAlert({ userId, type, message, isRead: false });
      res.status(201).json({ message: 'Alert created successfully', alert });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.getUserAlerts = async (req, res) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required to fetch alerts.' });
      }
  
      const alerts = await getUserAlerts(userId);
      res.status(200).json({ message: 'Alerts fetched successfully', alerts });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.getAllAlerts = async (req,res) => {
    try {
      const filter = {
        ...req.body.filter,
        userId:req.user.id,
      }

      const alerts = await getAllAlerts(filter);
      res.status(200).json({ message: 'Alerts fetched successfully', alerts });
    } catch (error) {
      res.status(500).json({ error: error.message });
    } 
  }
  
  exports.getAlertById = async (req, res) => {
    try {
      const alertId = req.params.alertId;
      if (!alertId) {
        return res.status(400).json({ message: 'Alert ID is required.' });
      }
  
      const alert = await findAlertById(alertId);
      if (!alert) {
        return res.status(404).json({ message: 'Alert not found.' });
      }
  
      res.status(200).json({ message: 'Alert fetched successfully', alert });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.upsertAlert = async (req, res) => {
    try {
      const { userId, type, message } = req.body;
      if (!userId || !type || !message) {
        return res.status(400).json({ message: 'All fields are required: userId, type, and message.' });
      }
  
      const alert = await upsertAlert(userId, type, message);
      res.status(200).json({ message: 'Alert created or updated successfully', alert });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.markAlertAsRead = async (req, res) => {
    try {
      const alertId = req.params.alertId;
      if (!alertId) {
        return res.status(400).json({ message: 'Alert ID is required.' });
      }
  
      const alert = await markAlertAsRead(alertId);
      res.status(200).json({ message: 'Alert marked as read successfully', alert });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.deleteAlertById = async (req, res) => {
    try {
      const alertId = req.params.alertId;
  
      if (!alertId) {
        return res.status(400).json({ message: 'Alert ID is required.' });
      }
  
      const deletedAlert = await deleteAlertById(alertId);
  
      res.status(200).json({
        message: 'Alert deleted successfully.',
        alert: deletedAlert,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.deleteAlertsByType = async (req, res) => {
    try {
      const { userId, type } = req.body;
      if (!userId || !type) {
        return res.status(400).json({ message: 'Both userId and type are required.' });
      }
  
      await deleteAlertsByType(userId, type);
      res.status(200).json({ message: 'Alerts deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  