const jwt  = require('jsonwebtoken');
const Problem = require('../../../models/').Problem;

exports.upload = async (req, res) => {
    const answer = req.body.answer;
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
        if ( !problem || !solution || !answer || !unit1 || !unit2 || !unit3 || !difficulty || !source || !date)
            throw new Error('Please enter all fields.');
        
        await Problem.create({ problem: problem.path, solution: solution.path, answer: answer,
                              unit1: unit1, unit2: unit2, unit3: unit3,
                              difficulty: difficulty, source:source, date:date });
        
        res.json({
            success: 'true',
            message: 'Successfully upload a problem.',
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
    const { id, unit1, unit2, unit3, difficulty, source, start_date, end_date } = req.body;
    /*
    try {
        let problems = Problem.find();
        
        if ( id !== undefined )
            problems = problems.where('_id').equals(id);
        else if ( unit1 !== undefined )
            problems = problems.where('unit1').equals(unit1);
        else if ( unit2 !== undefined )
            problems = problems.where('unit2').equals(unit2);
        else if ( unit3 !== undefined )
            problems = problems.where('unit3').equals(unit3);
        else if ( difficulty !== undefined )
            problems = problems.where('difficulty').equals(difficulty);
        else if ( source !== undefined )
            problems = problems.where('source').equals(source);
        else if ( start_date !== undefined )
            problems = problems.where('date').gt(start_date);
        else if ( end_date !== undefined )
            problems = problems.where('date').lt(end_date);
        
        console.log(problems);
    }
    catch (error) {
        res.status(403).json({
            success: 'false',
            message: error.message,
            ecode: 403
        });
    }
    */
}