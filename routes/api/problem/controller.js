const fs =  require('fs');
const path = require('path');
const jwt  = require('jsonwebtoken');
const Problem = require('../../../models/').Problem;

exports.create = async (req, res) => {
    const { problemFilename, solutionFilename,
            problemBase64, solutionBase64,
            isMultipleQuestion, answer, age, bigChapter, middleChapter, smallChapter, level, source, date } = req.body;
    
    try {
        if ( !problemFilename || !solutionFilename ||
             !problemBase64 || !solutionBase64 || 
             !isMultipleQuestion || !answer || !age || !bigChapter || !middleChapter || !smallChapter || !level || !source || !date)
            throw new Error('Please enter all fields.');
        
        problemPath = path.join('/uploads', problemFilename);
        fs.writeFile( path.join(__basedir, problemPath), 
                      new Buffer(problemBase64, 'base64'), 
                      (err) => { if (err) throw err; });
        
        solutionPath = path.join('/uploads', solutionFilename);
        fs.writeFile( path.join(__basedir, solutionPath),
                      new Buffer(solutionBase64, 'base64'),
                      (err) => { if (err) throw err; });
        
        await Problem.create({ problemURL: problemPath,
                               solutionURL: solutionPath,
                               isMultipleQuestion: isMultipleQuestion == "true" ? true: false,
                               answer: answer,
                               age:age,
                               bigChapter: bigChapter,
                               middleChapter: middleChapter,
                               smallChapter: smallChapter,
                               level: level,
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
    const { age, isMultipleQuestion, bigChapter, middleChapter, smallChapter, level, source, start_date, end_date } = req.body;

    try {
        let options = {};
        
        if ( age !== undefined && age !== '' )
            options.age = age;
        if ( isMultipleQuestion !== undefined && isMultipleQuestion !== '' )
            options.isMultipleQuestion = isMultipleQuestion == "true"? true: false;
        if ( bigChapter !== undefined && bigChapter !== '' )
            options.bigChapter = bigChapter;
        if ( middleChapter !== undefined && middleChapter !== '' )
            options.middleChapter = middleChapter;
        if ( smallChapter !== undefined && smallChapter !== '' )
            options.smallChapter = smallChapter;
        if ( level !== undefined && level !== '' )
            options.level = level;
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