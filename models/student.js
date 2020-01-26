module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('student', {
        studentId: { type: DataTypes.STRING },
        name: { type: DataTypes.STRING },
        school: { type: DataTypes.STRING },
        admissionYear: { type: DataTypes.STRING },
        mathGrade: { type: DataTypes.STRING },
        isRegular: { type: DataTypes.BOOLEAN, defaultValue: false },
        teacherId: { type: DataTypes.STRING }
    }, { timestamps: false });
    
    Student.findOneByUserid = function (userid) {
        return this.findOne({where: { studentId: userid } });
    }
    
    Student.associate = function(models) {
        Student.belongsTo(models.teacher, {
          foreignKey: 'teacherId'
        });
    };
    
    return Student;
}