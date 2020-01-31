'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('notes', 'index', 'id').then(() => queryInterface.renameColumn('notes', 'collectionID', 'collectionId')).then(() => queryInterface.renameColumn('notes', 'publishID', 'publishId')).then(() => queryInterface.renameColumn('notes', 'problemID', 'problemId')).then(() => queryInterface.changeColumn('notes', 'teacherID', {type: Sequelize.INTEGER})).then(() => queryInterface.renameColumn('notes', 'teacherID', 'teacherUserId'))
    .then(() => queryInterface.changeColumn('notes', 'studentID', {type: Sequelize.INTEGER})).then(() => queryInterface.renameColumn('notes', 'studentID', 'studentUserId')).then(() => queryInterface.changeColumn('notes', 'isCorrect', {type: Sequelize.STRING, defaultValue: "unconfirmed", allowNull: false})).then(() => queryInterface.renameColumn('notes', 'isCorrect', 'state'));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('notes', 'id', 'index').then(() => queryInterface.renameColumn('notes', 'collectionId', 'collectionID')).then(() => queryInterface.renameColumn('notes', 'publishId', 'publishID')).then(() => queryInterface.renameColumn('notes', 'problemId', 'problemID')).then(() => queryInterface.changeColumn('notes', 'teacherUserId', {type: Sequelize.STRING})).then(() => queryInterface.renameColumn('notes', 'teacherUserId', 'teacherID')).then(() => queryInterface.changeColumn('notes', 'studentUserId', {type: Sequelize.STRING})).then(() => queryInterface.renameColumn('notes', 'studentUserId', 'studentID')).then(() => queryInterface.changeColumn('notes', 'state', {type: Sequelize.BOOLEAN})).then(() => queryInterface.renameColumn('notes', 'state', 'isCorrect'));
  }
};
