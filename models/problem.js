module.exports = (sequelize, DataTypes) => {
  const Problem = sequelize.define(
    "problem",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      problemURL: {
        type: DataTypes.STRING,
        allowNull: false
      },
      solutionURL: {
        type: DataTypes.STRING
      },
      isMultipleQuestion: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      shortQuestionURL: {
        type: DataTypes.STRING
      },
      answer: { type: DataTypes.STRING },
      course: { type: DataTypes.STRING },
      bigChapter: { type: DataTypes.STRING },
      middleChapter: { type: DataTypes.STRING },
      smallChapter: { type: DataTypes.STRING },
      level: { type: DataTypes.STRING }, // need to fix
      source: { type: DataTypes.STRING },
      date: { type: DataTypes.STRING },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    { timestamps: false }
  );

  Problem.findOneById = function(id) {
    return this.findOne({ where: { id: id } });
  };

  return Problem;
};
