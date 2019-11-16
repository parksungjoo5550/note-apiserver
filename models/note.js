module.exports = (sequelize, DataTypes) => {
    const Note = sequelize.define('note', {
       index: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userid: { type: DataTypes.STRING },
        examID: { type: DataTypes.INTEGER },
        problemID: { type: DataTypes.INTEGER },
        answer: { type: DataTypes.STRING },
        state: { type: DataTypes.INTEGER },
        createdAt: { type: DataTypes.DATE }
    });
    
    Note.INCORRECT = 0;
    Note.CORRECT = 1;
    Note.UNCONFIRMED = -1;
    
    return Note;
}