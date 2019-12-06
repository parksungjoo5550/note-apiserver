module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
            userid: { type: DataTypes.STRING },
            password: { type: DataTypes.STRING },
            admin: { type: DataTypes.BOOLEAN, defaultValue: false },
        }, { timestamps: false });
    
    User.findOneByUserid = function (userid) {
        return this.findOne({ where: { userid: userid } });
    }
    
    User.prototype.verify = function (password) {
        return this.dataValues.password === password;
    }
    
    return User;
}