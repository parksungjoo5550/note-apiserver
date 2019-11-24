const Sequelize = require('sequelize');
const sequelize = new Sequelize('mydb', 'admin', 'root1234', {dialect: 'mysql'});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Student = require('./student')(sequelize, Sequelize);
db.Problem = require('./problem')(sequelize, Sequelize);
db.Exam = require('./exam')(sequelize, Sequelize);
db.Note = require('./note')(sequelize, Sequelize);

module.exports = db;

