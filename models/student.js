module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('student', {
        userid: { type: DataTypes.STRING },
        name: { type: DataTypes.STRING },
        school: { type: DataTypes.STRING },
        classOf: { type: DataTypes.INTEGER },    // Admission Year
        mathGrade: { type: DataTypes.INTEGER }
    }, { timestamps: false });
    
    Student.findOneByUserid = function (userid) {
        return this.findOne({ attributes: ['userid', 'password'], where: { userid: userid } });
    }
    
    return Student;
}