'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('students', 'userid', 'studentId').then(() => queryInterface.renameColumn('teachers', 'userid', 'teacherId'));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('students', 'studentId', 'userid').then(() => queryInterface.renameColumn('teachers', 'teacherId', 'userid'));
  }
};
