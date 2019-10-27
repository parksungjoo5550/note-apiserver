module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
            userid: { type: DataTypes.STRING },
            password: { type: DataTypes.STRING },
            admin: { type: DataTypes.BOOLEAN, default: false },
        }, { timestamps: false });
    
    User.findOneByUserid = function (userid) {
        return this.findOne( { attributes: ['userid', 'password'], where: { userid: userid } } );
    }
    
    User.prototype.verify = function (password) {
        return this.dataValues.password === password;
    }
    
    return User;
}