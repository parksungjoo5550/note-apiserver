module.exports = (sequelize, DataTypes) => {
    const Note = sequelize.define('note', {
       index: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userid: { type: DataTypes.STRING },
        problemID: { type: DataTypes.INTEGER },
        answer: { type: DataTypes.STRING },
        createdAt: { type: DataTypes.DATE }
    });
    
    return Note;
}