'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
      return queryInterface.addColumn('problems', 'course', Sequelize.STRING, { after: 'age'});
  },

  down: (queryInterface, Sequelize) => {
    
      return queryInterface.removeColumn('problems', 'course');
  }
};
