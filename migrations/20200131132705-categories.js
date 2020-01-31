'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('categories', 'index', 'id')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('categories', 'id', 'index')
  }
};
