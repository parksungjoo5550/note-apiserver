'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameTable('exams', 'collections').then(() => queryInterface.removeColumn('collections', 'problemIDList')).then(() => queryInterface.renameColumn('collections', 'examURL', 'pdfURL'));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameTable('collections', 'exams').then(() => queryInterface.addColumn('exams', 'problemIDList', Sequelize.STRING, {after: 'title'})).then(() => queryInterface.renameColumn('exams', 'pdfURL', 'examURL'));
  }
};
