'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('students', 'teacherId', {
      type: Sequelize.STRING
    }, {
      after: 'studentId'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('students', 'teacherId');
  }
};
