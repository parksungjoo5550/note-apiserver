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
      teacherUserId: { type: DataTypes.INTEGER },
      name: DataTypes.STRING
    },
    { timestamps: false }
  );

  Teacher.findOneByUserId = function(teacherUserId) {
    return this.findOne({ where: { teacherUserId: teacherUserId } });
  };

  Teacher.findOneByName = function(name) {
    return this.findOne({ where: { name: name } });
  };

  return Teacher;
};
