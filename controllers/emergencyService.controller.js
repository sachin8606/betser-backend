const { createEmergencyServices, getAllEmergencyServices, deleteEmergencyService, updateEmergencyService, findEmergencyServices, } = require('../db/queries/emergencyServices.queries');

exports.createEmergencyService = async (req, res) => {
  try {
    const { country, state, contact, serviceName } = req.body;
    if (!country || !state || !contact || !serviceName ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const service = await createEmergencyServices(req.body);
    res.status(201).json({ message: 'Service added successfully', service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmergencyServices = async (req, res) => {
  try {
    const services = await getAllEmergencyServices(req.body);
    res.status(200).json({ message: 'Services fetched successfully', services });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findEmergencyServices = async (req,res) => {
  try{
    const services = await findEmergencyServices(req.body);
    res.status(200).json({ message: 'Services fetched successfully', services });
  }catch(error){
    res.status(500).json({ error: error.message });
  }
}


exports.deleteEmergencyService = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: ' ID is required.' });
    }
    const service = await deleteEmergencyService(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }
    res.status(200).json({ message: 'Service deleted successfully', service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEmergencyService = async (req, res) =>{
  try {
    const {id,data} = req.body;
    if (!id) {
      return res.status(400).json({ message: ' ID is required.' });
    }
    const service = await updateEmergencyService(id,data);
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }
    res.status(200).json({ message: 'Service updated successfully', service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
