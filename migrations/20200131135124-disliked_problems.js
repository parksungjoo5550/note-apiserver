'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('disliked_problems', 'user_id', 'userId').then(() => queryInterface.renameColumn('disliked_problems', 'problem_id', 'problemId'));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('disliked_problems', 'userId', 'user_id').then(() => queryInterface.renameColumn('disliked_problems', 'problemId', 'problem_id'));
  }
};
