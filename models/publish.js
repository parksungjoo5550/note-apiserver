"use strict";
module.exports = (sequelize, DataTypes) => {
  const Publish = sequelize.define(
    "publish",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: {
        type: DataTypes.STRING
      },
      teacherUserId: {
        type: DataTypes.INTEGER
      },
      studentUserId: {
        type: DataTypes.INTEGER
      },
      collectionType: {
        type: DataTypes.STRING
      },
      collectionId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      remainingTime: {
        type: DataTypes.INTEGER
      },
      startPosition: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      state: {
        type: DataTypes.STRING,
        defaultValue: "published",
        allowNull: false
      }
    },
    {}
  );
  Publish.PUBLISHED = "published";
  Publish.OPENED = "opened";
  Publish.SAVED = "saved";
  Publish.SUBMITTED = "submitted";
  Publish.CONFIRMED = "confirmed";

  Publish.findOneById = function(id) {
    return this.findOne({ where: { id: id } });
  };

  Publish.listByTeacherUserId = function(teacherUserId) {
    return this.findAll({ where: { teacherUserId: teacherUserId } });
  };

  Publish.listByStudentUserId = function(studentUserId) {
    return this.findAll({ where: { studentUserId: studentUserId } });
  };

  return Publish;
};
