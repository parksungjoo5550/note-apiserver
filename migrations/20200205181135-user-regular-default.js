'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('students', 'isRegular', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('students', 'isRegular', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  }
};
