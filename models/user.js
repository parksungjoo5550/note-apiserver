module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
      type: { type: DataTypes.STRING }
    },
    { timestamps: false }
  );

  User.getAll = function() {
    return this.findAll({ raw: true });
  };

  User.findOneById = function(id) {
    return this.findOne({ where: { id: id } });
  };

  User.findOneByUsername = function(username) {
    return this.findOne({ where: { username: username } });
  };

  User.prototype.verify = function(password) {
    return this.dataValues.password === password;
  };

  return User;
};
