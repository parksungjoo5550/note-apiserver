"use strict";
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define(
    "teacher",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: { type: DataTypes.INTEGER },
      name: DataTypes.STRING
    },
    { timestamps: false }
  );

  Teacher.findOneByUserId = function(userId) {
    return this.findOne({ where: { userId: userId } });
  };

  Teacher.findAllByName = function(name) {
    return this.findOne({ where: { name: name } });
  };

  return Teacher;
};
