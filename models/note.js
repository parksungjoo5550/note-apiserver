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
        submit: { type: DataTypes.STRING },
        state: { type: DataTypes.INTEGER },
        createdAt: { type: DataTypes.STRING }
    });
    
    Note.INCORRECT = 0;
    Note.CORRECT = 1;
    Note.UNCONFIRMED = 2;
    Note.ASSIGNED = 3;
    
    Note.changeState = function (options, state) {
        return this.update({ state: state }, options);
    }
    
    return Note;
}