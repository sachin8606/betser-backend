'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new enum value 'cancelled' to status
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Requests_status') THEN
          CREATE TYPE "enum_Requests_status" AS ENUM ('pending', 'progress', 'resolved', 'failed');
        END IF;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Requests_status"
      ADD VALUE IF NOT EXISTS 'cancelled';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    console.warn("⚠️  Enum values cannot be removed in PostgreSQL with Sequelize. Manual rollback may be required.");
  }
};
