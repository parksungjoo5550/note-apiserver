module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
            userid: { type: DataTypes.STRING },
            password: { type: DataTypes.STRING },
            admin: { type: DataTypes.BOOLEAN,
                     default: false
                   },
        }, {
            timestamps: false
        }
    );
    
    User.findOneByUserid = function (userid) {
        return this.find( { attributes: ['userid'], where: { userid: userid } } );
    }
    
    User.prototype.verify = function (password) {
        return this.password === password;
    }
    
    return User;
}