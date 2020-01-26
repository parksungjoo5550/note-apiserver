module.exports = (sequelize, DataTypes) => {
    const Note = sequelize.define('note', {
       index: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        collectionID: { type: DataTypes.INTEGER },
        publishID: { type: DataTypes.INTEGER },
        problemID: { type: DataTypes.INTEGER },
        teacherID: { type: DataTypes.STRING },
        studentID: { type: DataTypes.STRING },
        submit: { type: DataTypes.STRING },
        isCorrect: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        createdAt: { type: DataTypes.STRING }
    });
    
    return Note;
}