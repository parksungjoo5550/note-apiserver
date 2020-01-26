'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('teacher', {
    teacherId: DataTypes.STRING,
    name: DataTypes.STRING
  }, { timestamps: false });
  Teacher.findOneByUserid = function (userid) {
    return this.findOne({where: { teacherId: userid }});
  }
  Teacher.associate = function(models) {
    Teacher.hasMany(models.student);
  };
  return Teacher;
};