module.exports = (sequelize, DataTypes) => {
  const Collection = sequelize.define(
    "collection",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: { type: DataTypes.STRING },
      title: { type: DataTypes.STRING },
      pdfURL: { type: DataTypes.STRING },
      timeLimit: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      isDone: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      type: {
        type: DataTypes.STRING
      },
      createdAt: { type: DataTypes.STRING }
    },
    { timestamps: false }
  );

  Collection.EXAM = "exam";
  Collection.HOMEWORK = "homework";
  Collection.WORKPAPER = "workpaper";

  Collection.findOneByUserid = function(userid) {
    return this.findOne({ where: { userid: userid } });
  };
  Collection.findOneById = function(id) {
    return this.findOne({ where: { id: id } });
  };

  return Collection;
};
