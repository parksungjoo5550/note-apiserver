module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('student', {
        userid: { type: DataTypes.STRING },
        name: { type: DataTypes.STRING },
        school: { type: DataTypes.STRING },
        admissionYear: { type: DataTypes.STRING },
        mathGrade: { type: DataTypes.STRING }
    }, { timestamps: false });
    
    Student.findOneByUserid = function (userid) {
        return this.findOne({where: { userid: userid } });
    }
    
    return Student;
}