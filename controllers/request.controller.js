const { createRequest, findRequestsByUser, findRequestById } = require('../db/queries/request.queries');

exports.createRequest = async (req, res) => {
  try {
    const { userId, type, description } = req.body;
    if (!userId || !type || !description) {
      return res.status(400).json({ message: 'All fields are required: userId, type, and details.' });
    }

    const request = await createRequest({ userId, type, description });
    res.status(201).json({ message: 'Request created successfully', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required to fetch requests.' });
    }
    const requests = await findRequestsByUser(userId);
    res.status(200).json({ message: 'Requests fetched successfully', requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getRequestById = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    if (!requestId) {
      return res.status(400).json({ message: 'Request ID is required.' });
    }
    const request = await findRequestById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }
    res.status(200).json({ message: 'Request fetched successfully', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
