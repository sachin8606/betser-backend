module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.changeColumn('Communications', 'message', {
      type: Sequelize.TEXT,
      allowNull: false
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Communications', 'message', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
