"use strict";
module.exports = (sequelize, DataTypes) => {
  const DislikedProblem = sequelize.define(
    "disliked_problem",
    {
      userId: {
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

  DislikedProblem.listByUserId = function(userId) {
    return this.findAll({ where: { userId: userId } });
  };

  return DislikedProblem;
};
