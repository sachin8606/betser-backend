module.exports = {
  up: async (queryInterface, Sequelize) => {

    // Change the id column type from UUID to STRING
    await queryInterface.changeColumn('Requests', 'type', {
      type: Sequelize.ENUM('Emergency', 'General', 'SOS'),
      allowNull: false,
    });

  },

  down: async (queryInterface, Sequelize) => {

    // Revert id column type back to UUID
    await queryInterface.changeColumn('Requests', 'type', {
      type: Sequelize.ENUM('Emergency', 'General'),
      allowNull: false,
    });
  }
};
