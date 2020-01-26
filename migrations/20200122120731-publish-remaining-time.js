'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('publishes', 'remainingTime', Sequelize.INTEGER, {after: 'collectionID'});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('publishes', 'remainingTime');
  }
};
