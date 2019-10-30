const fs =  require('fs');
const path = require('path');
const jwt  = require('jsonwebtoken');
const Problem = require('../../../models/').Problem;

exports.create = async (req, res) => {
    const { problemFilename, solutionFilename,
            problemBase64, solutionBase64,
            is_choice, answer, grade, unit1, unit2, unit3, difficulty, source, date } = req.body;
    
    try {
        if ( !problemFilename || !solutionFilename ||
             !problemBase64 || !solutionBase64 || 
             !is_choice || !answer || !grade || !unit1 || !unit2 || !unit3 || !difficulty || !source || !date)
            throw new Error('Please enter all fields.');
        
        problemPath = path.join('/uploads', problemFilename);
        fs.writeFile( path.join(__basedir, problemPath), 
                      new Buffer(problemBase64, 'base64'), 
                      (err) => { if (err) throw err; });
        
        solutionPath = path.join('/uploads', solutionFilename);
        fs.writeFile( path.join(__basedir, solutionPath),
                      new Buffer(solutionBase64, 'base64'),
                      (err) => { if (err) throw err; });
        
        await Problem.create({ problem: problemPath,
                               solution: solutionPath,
                               is_choice: is_choice == "true" ? true: false,
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

exports.update = async (req, res) => {
    
}

exports.inquiry = async (req, res) => {
    const { grade, is_choice, unit1, unit2, unit3, difficulty, source, start_date, end_date } = req.body;

    try {
        let options = {};
        
        if ( grade !== undefined && grade !== '' )
            options.grade = grade;
        if ( is_choice !== undefined && is_choice !== '' )
            options.is_choice = is_choice == "true"? true: false;
        if ( unit1 !== undefined && unit1 !== '' )
            options.unit1 = unit1;
        if ( unit2 !== undefined && unit2 !== '' )
            options.unit2 = unit2;
        if ( unit3 !== undefined && unit3 !== '' )
            options.unit3 = unit3;
        if ( difficulty !== undefined && difficulty !== '' )
            options.difficulty = difficulty;
        if ( source !== undefined && source !== '' )
            options.source = source;
        if ( start_date !== undefined && start_date !== '' )
            options.date = { $gt: start_date };
        if ( end_date !== undefined && end_date !== '' )
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