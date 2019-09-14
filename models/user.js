const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    userid: String,
    password: String,
    admin: { type: Boolean, default: false }
});

// Create a user document
User.statics.create = function (userid, password) {
    const user = new this({
        userid,
        password // must be hashed.
    });
    
    return user.save();
};

// find a user by userid
User.statics.findOneByUserid = function (_userid) {
    return this.findOne({
        userid: _userid
    });
}

User.methods.verify = function (password) {
    return this.password == password;
}

module.exports = mongoose.model('User', User);