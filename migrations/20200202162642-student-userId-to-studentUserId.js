'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('students', 'userId', 'studentUserId');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('students', 'studentUserId', 'userId');
  }
};
