Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Room = sequelize.define('room', {
        index: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        examID: { 
            type: DataTypes.INTEGER,
            allowNull: false
        },
        useridList: { type: DataTypes.STRING },
        type: { 
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, { timestamps: false });
    
    Room.ASSIGNED = 0;
    Room.HOMEWORK = 1;
    
    Room.findOneByindex = function (index) {
        return this.findOne({ where: { index: index } });
    }
    
    Room.isExist = function (examID, type) {
        return this.findOne({ where: { examID: examID, type: type }});
    }
    
    Room.isUserIncluded = function (examID, type, userid) {
        return this.findOne({ where: { examID: examID, type: type, useridList: { [Sequelize.Op.like]: `%${userid}%` } }})
    }
    
    Room.isUserAssigned = function (examID, userid) {
        return this.isUserIncluded(examID, this.ASSIGNED, userid);
    }
    
    
    
    return Room;
}