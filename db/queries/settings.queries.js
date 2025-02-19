const Settings = require('../../models/setting.model');

exports.createSetting = async (data) => {
  return await Settings.create(data);
};

exports.fetchSettings = async () => {
  const result = await Settings.findAll();

  return result
};

exports.updateSetting = async (id, newData) => {
  const setting = await Settings.findByPk(id);
  if (!setting) {
    throw new Error('Not found.')
  }
  await setting.update(newData);
  return setting;
};
