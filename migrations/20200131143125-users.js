'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('users', 'userid', 'username').then(() => queryInterface.removeColumn('users', 'admin'));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('users', 'username', 'userid').then(() => queryInterface.addColumn('users', 'admin', {type: Sequelize.BOOLEAN, defaultValue: false}));
  }
};
