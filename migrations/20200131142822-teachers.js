'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('teachers', 'teacherId', 'teacherUserId');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('teachers', 'teacherUserId', 'teacherId');
  }
};
