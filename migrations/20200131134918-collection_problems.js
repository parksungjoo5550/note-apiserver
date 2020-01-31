'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('collection_problems', 'collectionID', 'collectionId').then(() => queryInterface.renameColumn('collection_problems', 'problemID', 'problemId'));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('collection_problems', 'collectionId', 'collectionID').then(() => queryInterface.renameColumn('collection_problems', 'problemId', 'problemID'));
  }
};
