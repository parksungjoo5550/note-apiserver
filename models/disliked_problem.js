'use strict';
module.exports = (sequelize, DataTypes) => {
  const DislikedProblem = sequelize.define('disliked_problem', {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    problem_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  DislikedProblem.associate = function(models) {
    // associations can be defined here
  };
  DislikedProblem.listByUserId = function (user_id) {
    return this.findAll({ where: { user_id: user_id } })
  }
  return DislikedProblem;
};