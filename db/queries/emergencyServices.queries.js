const { Op } = require('sequelize');
const EmergencyServices = require('../../models/emergencyServices.model');

// Create Emergency Service
exports.createEmergencyServices = async (data) => {
  return await EmergencyServices.create(data);
};

// Get all Emergency Services
exports.getAllEmergencyServices = async ({ filter = {}, page = 1, limit = 10 }) => {

  const query = {};

  if (filter.searchKeyword) {
    query[Op.or] = [
      { country: { [Op.iLike]: `%${filter.searchKeyword}%` } },
      { state: { [Op.iLike]: `%${filter.searchKeyword}%` } }
    ];
  }
  const offset = (page - 1) * limit;
  const services = await EmergencyServices.findAndCountAll({
    where: query,
    limit,
    offset,
  });

  return {
    totalPages: Math.ceil(services.count / limit),
    currentPage: page,
    services: services.rows,
  };
};

// Find emergency contacts
exports.findEmergencyServices = async({ filter={}, page=1, limit=10 }) => {
  const offset = (page - 1) * limit;
  const queryFilter = {};

  if (filter.country) {
    queryFilter.country = { [Op.iLike]: `%${filter.country}%` };
  }
  if (filter.state) {
    queryFilter.state = { [Op.iLike]: `%${filter.state}%` };
  }
  if (filter.city) {
    queryFilter.city = { [Op.iLike]: `%${filter.city}%` };
  }
    const services = await EmergencyServices.findAndCountAll({
      where: queryFilter,
      limit,
      offset,
    });

    return {
      totalPages: Math.ceil(services.count / limit),
      currentPage: page,
      services: services.rows,
    };
}

// Delete Emergency Service 
exports.deleteEmergencyService = async (id) => {
  const service = await EmergencyServices.findByPk(id);
  if (!service) {
    throw new Error('Service not found.')
  }
  await service.destroy();
  return service;
}

// Update Emergency Service 
exports.updateEmergencyService = async (id, newData) => {
  const service = await EmergencyServices.findByPk(id);
  if (!service) {
    throw new Error('Service not found.')
  }
  await service.update(newData);
  return service;
}


