module.exports = (sequelize, DataTypes) => {
    const Exam = sequelize.define('exam', {
        index: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userid: { type: DataTypes.STRING },
        title: { type: DataTypes.STRING },
        problemIDList: { type: DataTypes.STRING },
        examURL: { type: DataTypes.STRING }, 
        isDone: { 
            type: DataTypes.BOOLEAN,
            default: false
        },
        createdAt: { type: DataTypes.STRING }
    }, { timestamps: false });
    
    Exam.findOneByUserid = function (userid) {
        return this.findOne({ where: { userid: userid } });
    }
    
    return Exam;
}