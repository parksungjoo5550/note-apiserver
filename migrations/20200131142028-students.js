'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('students', 'studentId', {type: Sequelize.INTEGER}).then(() => queryInterface.renameColumn('students', 'studentId', 'userId')).then(() => queryInterface.renameColumn('students', 'teacherId', 'teacherUserId'));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('students', 'userId', {type: Sequelize.INTEGER}).then(() => queryInterface.renameColumn('students', 'userId', 'studentId')).then(() => queryInterface.renameColumn('students', 'teacherUserId', 'teacherId'));
  }
};
