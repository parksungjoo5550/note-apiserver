const path = require('path');
const jwt  = require('jsonwebtoken');
const Problem = require('../../../models/').Problem;

exports.create = async (req, res) => {
    const is_choice = req.body.is_choice;
    const answer = req.body.answer;
    const grade = req.body.grade;
    const unit1 = req.body.unit1;
    const unit2 = req.body.unit2;
    const unit3 = req.body.unit3;
    const difficulty = req.body.difficulty;
    const source = req.body.source;
    const date = req.body.date;
    
    const problem = req.files['problem'][0];
    const solution = req.files['solution'][0];
    
    console.log(date);
    try {
        if ( !is_choice || !problem || !solution || !answer || !grade || !unit1 || !unit2 || !unit3 || !difficulty || !source || !date)
            throw new Error('Please enter all fields.');
        
        await Problem.create({ is_choice: is_choice == "true" ? true: false,
                              problem: path.join('/uploads/' + problem.filename),
                              solution: path.join('/uploads/' + solution.filename),
                              answer: answer,
                              grade: grade,
                              unit1: unit1,
                              unit2: unit2,
                              unit3: unit3,
                              difficulty: difficulty,
                              source: source,
                              date: date });
        
        res.json({
            success: 'true',
            message: 'Successfully created a problem.',
            ecode: 200
        });
    }
    catch (error) {
        res.status(403).json({
            success: 'false',
            message: error.message,
            ecode: 403
        });
    }
}

exports.inquiry = async (req, res) => {
    const { grade, unit1, unit2, unit3, difficulty, source, start_date, end_date } = req.body;
    
    try {
        let options = {};
        
        if ( grade !== undefined )
            options.grade = grade;
        if ( unit1 !== undefined )
            options.unit1 = unit1;
        if ( unit2 !== undefined )
            options.unit2 = unit2;
        if ( unit3 !== undefined )
            options.unit3 = unit3;
        if ( difficulty !== undefined )
            options.difficulty = difficulty;
        if ( source !== undefined )
            options.source = source;
        if ( start_date !== undefined )
            options.date = { $gt: start_date };
        if ( end_date !== undefined )
            options.date = { $lt: end_date };
        
        let results = await Problem.findAll({ where: options });
        let problems = [];
        
        for (let i = 0; i < results.length; i++)
            problems.push(results[i].dataValues);
        
        res.json({
            success: 'true',
            message: 'Successfully inquiried a problem database',
            ecode: 200,
            data: { problems: problems },
        });
        
    }
    catch (error) {
        res.status(403).json({
            success: 'false',
            message: error.message,
            ecode: 403
        });
    }
    
}