module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Add new UUID columns
    await queryInterface.addColumn('Communications', 'senderId_tmp', {
      type: Sequelize.UUID,
      allowNull: false,
    });

    await queryInterface.addColumn('Communications', 'receiverId_tmp', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    // Step 2: Copy data from old columns (if necessary)
    // Uncomment if you want to keep old IDs
    // await queryInterface.sequelize.query(`
    //   UPDATE "Communications" SET "senderId_tmp" = "senderId"::text::uuid, "receiverId_tmp" = "receiverId"::text::uuid
    // `);

    // Step 3: Remove old columns
    await queryInterface.removeColumn('Communications', 'senderId');
    await queryInterface.removeColumn('Communications', 'receiverId');

    // Step 4: Rename new columns
    await queryInterface.renameColumn('Communications', 'senderId_tmp', 'senderId');
    await queryInterface.renameColumn('Communications', 'receiverId_tmp', 'receiverId');
  },

  async down(queryInterface, Sequelize) {
    // Rollback: Recreate INTEGER columns
    await queryInterface.addColumn('Communications', 'senderId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.addColumn('Communications', 'receiverId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // Remove the UUID columns
    await queryInterface.removeColumn('Communications', 'senderId');
    await queryInterface.removeColumn('Communications', 'receiverId');
  }
};
