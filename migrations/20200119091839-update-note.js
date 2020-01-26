'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('notes', 'examID', 'collectionID').then(() => queryInterface.renameColumn('notes', 'userid', 'teacherID')).then(() => queryInterface.addColumn('notes', 'publishID', Sequelize.INTEGER, {after: 'collectionID'})).then(() => queryInterface.addColumn('notes', 'studentID', Sequelize.STRING, {after: 'teacherID'})).then(() => queryInterface.removeColumn('notes', 'state')).then(() => queryInterface.addColumn('notes', 'isCorrect', Sequelize.BOOLEAN, {after: 'submit', allowNull: true}));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('notes', 'collectionID', 'examID').then(() => queryInterface.renameColumn('notes', 'teacherID', 'userid')).then(() => queryInterface.removeColumn('notes', 'publishID')).then(() => queryInterface.removeColumn('notes', 'studentID')).then(() => queryInterface.removeColumn('notes', 'isCorrect')).then(() => queryInterface.addColumn('notes', 'state', Sequelize.INTEGER, {after: 'submit'}));
  }
};
