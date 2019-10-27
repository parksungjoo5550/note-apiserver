const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

// Load env setting
require('dotenv').config();

const dbcon = mongoose.createConnection(process.env.MONGO_URL);
autoIncrement.initialize(dbcon);

const Problem = new Schema({
    problem: {
        type: String,
        required: true
    },
    solution: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    unit1: String,
    unit2: String,
    unit3: String,
    difficulty: Number,
    source: String,
    date: Date,
    rate: Number,
});

// Create a problem
Problem.statics.create = function (problem, solution, answer, unit1, unit2, unit3, difficulty, source, date) {
    const pm = new this({
        problem: problem,
        solution: solution,
        answer: answer,
        unit1: unit1,
        unit2: unit2,
        unit3: unit3,
        difficulty: difficulty,
        source: source,
        date: date,
        rate: 0
    });
    
    return pm.save();
}

// Find a problem by "_id"
Problem.statics.findOneByid = function (id) {
    return this.findOne({
        _id: id
    });
}

Problem.plugin(autoIncrement.plugin, 'Problem');

const problem = dbcon.model('Problem', Problem);
module.exports = mongoose.model('Problem', Problem);