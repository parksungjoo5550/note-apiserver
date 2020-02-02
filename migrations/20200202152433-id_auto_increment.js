'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('categories', 'id', {
        type: Sequelize.INTEGER,
        autoIncrement: true
      }).then(() => queryInterface.changeColumn('collections', 'id', {
        type: Sequelize.INTEGER,
        autoIncrement: true
      })).then(() => queryInterface.changeColumn('notes', 'id', {
        type: Sequelize.INTEGER,
        autoIncrement: true
      })).then(() => queryInterface.changeColumn('problems', 'id', {
        type: Sequelize.INTEGER,
        autoIncrement: true
      }));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('categories', 'id', {
        type: Sequelize.INTEGER,
        autoIncrement: false
      }).then(() => queryInterface.changeColumn('collections', 'id', {
        type: Sequelize.INTEGER,
        autoIncrement: false
      })).then(() => queryInterface.changeColumn('notes', 'id', {
        type: Sequelize.INTEGER,
        autoIncrement: false
      })).then(() => queryInterface.changeColumn('problems', 'id', {
        type: Sequelize.INTEGER,
        autoIncrement: false
      }));
  }
};
