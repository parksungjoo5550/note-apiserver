'use strict';
module.exports = (sequelize, DataTypes) => {
  const publish = sequelize.define('publish', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    teacherID: {
      type: DataTypes.STRING
    },
    studentID: {
      type: DataTypes.STRING
    },
    collectionID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    remainingTime: {
      type: DataTypes.INTEGER
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  publish.PUBLISHED = 'published';
  publish.OPENED = 'opened';
  publish.SAVED = 'saved';
  publish.SUBMITTED = 'submitted';
  publish.CONFIRMED = 'confirmed;'
  publish.associate = function(models) {
    // associations can be defined here
  };
  publish.listByTeacherId = function (teacherID) {
    return this.findAll({ where: {teacherID: teacherID} });
  };
  publish.listByStudentId = function (studentID) {
    return this.findAll({ where: {studentID: studentID} });
  };
  return publish;
};