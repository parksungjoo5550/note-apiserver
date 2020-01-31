'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('problems', 'index', 'id').then(() => queryInterface.renameColumn('problems', 'shortQuestion', 'shortQuestionURL'));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('problems', 'id', 'index').then(() => queryInterface.renameColumn('problems', 'shortQuestionURL', 'shortQuestion'));
  }
};
