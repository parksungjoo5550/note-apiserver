'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('publishes', 'startPosition', { type: Sequelize.INTEGER, defaultValue: 0 });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('publishes', 'startPosition');
  }
};
