'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('notes', 'updatedAt', { type: Sequelize.STRING, allowNull: true });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('notes', 'updatedAt', { type: Sequelize.DATETIME, allowNull: false });
  }
};
