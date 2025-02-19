const { createSetting, fetchSettings, updateSetting } = require("../db/queries/settings.queries");

exports.createSettingFun = async (req, res) => {
  try {
    const setting = await createSetting(req.body);
    if (setting) {
      return res.status(201).json({ message: 'success', setting });
    }
    throw new Error("Failed")
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSettingFun = async (req, res) => {
  try {
    const settings = await fetchSettings();
    res.status(200).json({ message: 'success', settings });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

exports.updateSettingsFun = async (req, res) => {
  try {
    const updated = await updateSetting(req.params.id, req.body);
    if (updated) {
      return res.status(200).json({ message: 'Updated successfully', updated });
    }
    throw new Error("Failed")
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}