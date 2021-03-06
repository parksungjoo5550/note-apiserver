module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define("note", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    collectionId: { type: DataTypes.INTEGER },
    publishId: { type: DataTypes.INTEGER },
    problemId: { type: DataTypes.INTEGER },
    teacherUserId: { type: DataTypes.INTEGER },
    studentUserId: { type: DataTypes.INTEGER },
    submit: { type: DataTypes.STRING },
    state: {
      type: DataTypes.STRING,
      defaultValue: "unconfirmed",
      allowNull: false
    },
    createdAt: { type: DataTypes.STRING },
    updatedAt: { type: DataTypes.STRING }
  }, { timestamps: false }
  );

  Note.UNCONFIRMED = "unconfirmed";
  Note.CORRECT = "correct";
  Note.INCORRECT = "incorrect";

  Note.findAllByPublishId = function(publishId) {
    return this.findAll({ where: { publishId: publishId } });
  };
  
  Note.findOneByPublishIdAndProblemId = function(publishId, problemId) {
    return this.findOne({ where: { publishId: publishId, problemId: problemId } });
  }

  return Note;
};
