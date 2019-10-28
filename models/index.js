const Sequelize = require('sequelize');
const sequelize = new Sequelize('mydb', 'guest', '1234', {dialect: 'mysql'});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Student = require('./student')(sequelize, Sequelize);
db.Problem = require('./problem')(sequelize, Sequelize);
db.Exam = require('./exam')(sequelize, Sequelize);

module.exports = db;

