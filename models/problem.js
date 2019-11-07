module.exports = (sequelize, DataTypes) => {
    const Problem = sequelize.define('problem', {
        index: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        problemURL: {
            type: DataTypes.STRING,
            allowNull: false
        },
        solutionURL: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isMultipleQuestion: {
            type: DataTypes.BOOLEAN,
        },
        answer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age: { type: DataTypes.STRING },
        bigChapter: { type: DataTypes.STRING },
        middleChapter: { type: DataTypes.STRING },
        smallChapter: { type: DataTypes.STRING },
        level: { type: DataTypes.INTEGER },
        source: { type: DataTypes.STRING },
        date: { type: DataTypes.DATE },
        successRate: { type: DataTypes.INTEGER }
    }, { timestamps: false });
    
    Problem.findOneByindex = function (index) {
        return this.findOne({ where: { index: index} });
    }
    
    return Problem;
}