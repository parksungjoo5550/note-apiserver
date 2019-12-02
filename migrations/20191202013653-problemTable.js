'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
      return queryInterface.addColumn('problems', 'active', {
                type: Sequelize.BOOLEAN,
                default: true 
            }).then(() =>
                queryInterface.bulkUpdate('problems', {active: true})
            );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
     return queryInterface.removeColumn('problems', 'active');
  }
};
