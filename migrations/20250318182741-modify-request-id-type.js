module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove primary key constraint first
    await queryInterface.removeConstraint('Requests', 'Requests_pkey');

    // Change the id column type from UUID to STRING
    await queryInterface.changeColumn('Requests', 'id', {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    });

    // Re-add primary key constraint on the updated id column
    await queryInterface.addConstraint('Requests', {
      fields: ['id'],
      type: 'primary key',
      name: 'Requests_pkey',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove primary key constraint before reverting column type
    await queryInterface.removeConstraint('Requests', 'Requests_pkey');

    // Revert id column type back to UUID
    await queryInterface.changeColumn('Requests', 'id', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
    });

    // Re-add primary key constraint on id column
    await queryInterface.addConstraint('Requests', {
      fields: ['id'],
      type: 'primary key',
      name: 'Requests_pkey',
    });
  }
};
