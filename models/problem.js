module.exports = (sequelize, DataTypes) => {
    const Problem = sequelize.define('problem', {
        index: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        problem: {
            type: DataTypes.STRING,
            allowNull: false
        },
        solution: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_choice: {
            type: DataTypes.BOOLEAN,
        },
        answer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        grade: { type: DataTypes.STRING },
        unit1: { type: DataTypes.STRING },
        unit2: { type: DataTypes.STRING },
        unit3: { type: DataTypes.STRING },
        difficulty: { type: DataTypes.INTEGER },
        source: { type: DataTypes.STRING },
        date: { type: DataTypes.DATE },
        rate: { type: DataTypes.INTEGER }
    }, { timestamps: false });
    
    Problem.findOneByindex = function (index) {
        return this.findOne({ where: { index: index} });
    }
    
    return Problem;
}