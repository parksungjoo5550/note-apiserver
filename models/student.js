module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    "student",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      studentUserId: { type: DataTypes.INTEGER },
      teacherUserId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      name: { type: DataTypes.STRING },
      school: { type: DataTypes.STRING },
      admissionYear: { type: DataTypes.STRING },
      mathGrade: { type: DataTypes.STRING },
      isRegular: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    { timestamps: false }
  );

  Student.findOneByUserId = function(studentUserId) {
    return this.findOne({ where: { studentUserId: studentUserId } });
  };

  Student.findOneByName = function(name) {
    return this.findOne({ where: { name: name } });
  };

  Student.findAllByTeacherUserId = function(teacherUserId) {
    return this.findAll({ where: { teacherUserId: teacherUserId } });
  };

  return Student;
};
