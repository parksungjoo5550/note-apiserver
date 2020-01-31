'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('publishes', 'title', {type: Sequelize.STRING}).then(() => queryInterface.renameColumn('publishes', 'collectionID', 'collectionId')).then(() => queryInterface.changeColumn('publishes', 'teacherID', {type: Sequelize.INTEGER})).then(() => queryInterface.renameColumn('publishes', 'teacherID', 'teacherUserId')).then(() => queryInterface.changeColumn('publishes', 'studentID', {type: Sequelize.INTEGER})).then(() => queryInterface.renameColumn('publishes', 'studentID', 'studentUserId')).then(() => queryInterface.addColumn('publishes', 'collectionType', {type: Sequelize.STRING}));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('publishes', 'title').then(() => queryInterface.renameColumn('publishes', 'collectionId', 'collectionID')).then(() => queryInterface.changeColumn('publishes', 'teacherUserId', {type: Sequelize.STRING})).then(() => queryInterface.renameColumn('publishes', 'teacherUserId', 'teacherID')).then(() => queryInterface.changeColumn('publishes', 'studentUserId', {type: Sequelize.INTEGER})).then(() => queryInterface.renameColumn('publishes', 'studentUserId', 'studentID')).then(() => queryInterface.removeColumn('publishes', 'collectionType'));
  }
};
