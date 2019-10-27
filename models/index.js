const Sequelize = require('sequelize');
const sequelize = new Sequelize('mydb', 'root', '', {dialect: 'mysql'});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);

module.exports = db;

