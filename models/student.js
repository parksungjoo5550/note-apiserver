const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Student = new Schema({
    userid: String,
    name: String,
    school: String,
    classOf: Number,    // Admission Year
    mathGrade: Number
});

// Create a student.
Student.statics.create = function (userid, name, school, classOf, mathGrade) {
    const student = new this({
        userid,
        name,
        school,
        classOf,
        mathGrade
    });
    
    return student.save();
}

// Find a student by userid.
Student.statics.findOneByUserid = function (_userid) {
    return this.findOne({
        userid: _userid
    });
}

module.exports = mongoose.model('Student', Student);