module.exports = (sequelize, DataTypes) => {
    const Exam = sequelize.define('exam', {
        index: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userid: { type: DataTypes.STRING },
        title: { type: DataTypes.STRING },
        problems: { type: DataTypes.STRING },
        date: { 
            type: DataTypes.DATE,
            defalut: DataTypes.NOW 
        }
    }, { timestamps: false });
    
    Exam.findOneByUserid = function (userid) {
        return this.findOne({ where: { userid: userid } });
    }
    
    return Exam;
}