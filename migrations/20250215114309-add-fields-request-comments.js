'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Requests', 'comments', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [],
    });
    await queryInterface.removeColumn('Requests', 'comment');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Requests', 'comments');
    await queryInterface.addColumn('Requests', 'comment', {
        type: Sequelize.TEXT,
        allowNull: true
      });
  }
};
