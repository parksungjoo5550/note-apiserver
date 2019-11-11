// Modules
const fs =  require('fs');
const path = require('path');
const jwt  = require('jsonwebtoken');

// Models
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
        
        // Save Problem and Solution file.
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

exports.get = async (req, res) => {
    // url, is
    const { problemID } = req.body;
    
    try {
        problem =  await Problem.findOneByindex(problemList[i]);
        if ( problem == null ) 
            throw new Error('That problem doesn\'t exist.');
        
        res.json({
            success: 'true',
            message: 'Successfully got problem information',
            ecode: 200,
            data: { problemID: problem.dataValues.index,
                    problemURL: problem.dataValues.problemURL,
                    isMultipleQuestion: problem.dataValues.isMultipleQuestion },
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
    const { age, isMultipleQuestion, bigChapter, middleChapter, smallChapter, level, source, startDate, endDate } = req.body;

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
        if ( startDate !== undefined && startDate !== '' )
            options.date = { $gt: startDate };
        if ( endDate !== undefined && endDate !== '' )
            options.date = { $lt: endDate };
        
        let results = await Problem.findAll({ where: options });
        let problems = [];
        
        for (let i = 0; i < results.length; i++)
            problems.push({ problemID: results[i].dataValues.index,
                            problemURL: results[i].dataValues.problemURL, 
                            isMultipleQuestion: results[i].dataValues.isMultipleQuestion,
                            problemCondition: {
                                age: results[i].dataValues.age,
                                bigChapter: results[i].dataValues.bigChapter,
                                middleChapter: results[i].dataValues.middleChapter,
                                smallChapter: results[i].dataValues.smallChapter,
                                level: results[i].dataValues.level,
                                source: results[i].dataValues.source
                            }                      
                          });
        
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