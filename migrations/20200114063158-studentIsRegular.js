'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('students', 'isRegular', {
      type: Sequelize.BOOLEAN,
      defaultValue: false 
    }, {
      after: 'mathGrade'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('students', 'isRegular');
  }
};
