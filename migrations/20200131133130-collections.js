'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('collections', 'index', 'id').then(() => queryInterface.changeColumn('collections', 'userid', {type: Sequelize.INTEGER})).then(() => queryInterface.renameColumn('collections', 'userid', 'userId')).then(() => queryInterface.changeColumn('collections', 'type', {type: Sequelize.STRING}));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('collections', 'id', 'index').then(() => queryInterface.changeColumn('collections', 'userId', {type: Sequelize.STRING})).then(() => queryInterface.renameColumn('collections', 'userId', 'userid')).then(() => queryInterface.changeColumn('collections', 'type', {type: Sequelize.INTEGER}));
  }
};
