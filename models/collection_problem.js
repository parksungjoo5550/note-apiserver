"use strict";
module.exports = (sequelize, DataTypes) => {
  const collection_problem = sequelize.define(
    "collection_problem",
    {
      collectionId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      problemId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );

  collection_problem.listProblemIdByCollectionId = function(collectionId) {
    return this.findAll({ where: { collectionId: collectionId } });
  };

  return collection_problem;
};
