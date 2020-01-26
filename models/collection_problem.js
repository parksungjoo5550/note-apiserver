'use strict';
module.exports = (sequelize, DataTypes) => {
  const collection_problem = sequelize.define('collection_problem', {
    collectionID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    problemID: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  collection_problem.listProblemIdByCollectionId = function (collectionID) {
    return this.findAll({ where: { collectionID: collectionID } });
  }
  return collection_problem;
};